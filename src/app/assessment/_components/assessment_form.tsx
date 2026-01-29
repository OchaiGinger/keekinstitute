"use client";

import { useState } from "react";
import { useMutation, useConvexAuth } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../../convex/_generated/api";
import { ASSESSMENT_QUESTIONS, TECH_PATHS } from "../questions";
import { calculatePathRecommendation } from "../path-analysis";
import AssessmentResults from "./assessment_results";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface AssessmentFormProps {
    onComplete?: () => void;
}

export default function AssessmentForm({ onComplete }: AssessmentFormProps) {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const { user } = useUser();
    const submitAssessment = useMutation(api.assessment.submitAssessment);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const currentQuestion = ASSESSMENT_QUESTIONS[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100;

    const handleSelectAnswer = (option: string) => {
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: option,
        }));
    };

    const handleNext = () => {
        if (!answers[currentQuestion.id]) {
            setError("Please select an answer before proceeding.");
            return;
        }
        setError(null);
        if (currentQuestionIndex < ASSESSMENT_QUESTIONS.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
        setError(null);
    };

    const handleSubmit = async () => {
        setError(null);

        // Validate all questions are answered
        if (Object.keys(answers).length !== ASSESSMENT_QUESTIONS.length) {
            setError("Please answer all questions before submitting.");
            return;
        }

        if (!isAuthenticated) {
            setError("Authentication not ready. Please wait.");
            return;
        }

        try {
            setLoading(true);

            // Calculate path recommendation
            const analysisResult = calculatePathRecommendation(answers);

            // Prepare answers for Convex
            const assessmentAnswers = ASSESSMENT_QUESTIONS.map((q) => {
                const selectedOptionText = answers[q.id];
                const selectedOption = q.options.find((opt) => opt.text === selectedOptionText);
                return {
                    questionId: q.id,
                    selectedOption: selectedOptionText,
                    selectedPath: selectedOption?.path || "",
                };
            });

            // Submit to Convex
            await (submitAssessment as any)({
                clerkId: user?.id,
                recommendedPath: analysisResult.recommendedPath,
                pathScores: analysisResult.pathScores,
                analysis: analysisResult.analysis,
                answers: assessmentAnswers,
            });

            // Show results immediately (Convex will be saved by now)
            setResult(analysisResult);
        } catch (err) {
            setError("Failed to submit assessment. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRetake = () => {
        setCurrentQuestionIndex(0);
        setAnswers({});
        setResult(null);
        setError(null);
    };

    if (isLoading) return null;

    // Show results if assessment was completed
    if (result) {
        return (
            <AssessmentResults
                assessment={{
                    recommendedPath: result.recommendedPath,
                    pathScores: result.pathScores,
                    analysis: result.analysis,
                    completedAt: Date.now(),
                    authUserId: "",
                }}
                onRetake={handleRetake}
                onComplete={onComplete}
            />
        );
    }

    // Show form if no results
    // Show form if no results
    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Tech Career Path Assessment</CardTitle>
                <CardDescription>
                    Question {currentQuestionIndex + 1} of {ASSESSMENT_QUESTIONS.length}
                </CardDescription>
                <Progress value={progress} className="mt-4" />
            </CardHeader>

            <CardContent className="space-y-6">
                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Question */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{currentQuestion.question}</h3>

                    {/* Options */}
                    <RadioGroup
                        value={answers[currentQuestion.id] || ""}
                        onValueChange={handleSelectAnswer}
                    >
                        <div className="space-y-3">
                            {currentQuestion.options.map((option) => (
                                <div key={option.text} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option.text} id={option.text} />
                                    <Label
                                        htmlFor={option.text}
                                        className="cursor-pointer flex-1 font-normal"
                                    >
                                        {option.text}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </RadioGroup>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between gap-4">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0 || loading}
                    >
                        Previous
                    </Button>

                    {currentQuestionIndex === ASSESSMENT_QUESTIONS.length - 1 ? (
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? "Analyzing..." : "Submit Assessment"}
                        </Button>
                    ) : (
                        <Button onClick={handleNext} disabled={loading}>
                            Next
                        </Button>
                    )}
                </div>

                {/* Answer Summary */}
                <div className="mt-6 p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                        Answered: {Object.keys(answers).length} / {ASSESSMENT_QUESTIONS.length}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
