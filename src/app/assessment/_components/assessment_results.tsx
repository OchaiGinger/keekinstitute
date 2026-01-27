"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TECH_PATHS } from "../questions";
import { useState } from "react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, RotateCcw } from "lucide-react";
import Link from "next/link";

interface AssessmentResultsProps {
    assessment: any;
    onRetake: () => void;
    isFromExisting?: boolean;
    onComplete?: () => void;
}

export default function AssessmentResults({
    assessment,
    onRetake,
    isFromExisting = false,
    onComplete,
}: AssessmentResultsProps) {
    const [isRetaking, setIsRetaking] = useState(false);
    const deleteAssessment = useMutation(api.assessment.deleteLatestAssessmentByUserId);

    const recommendedPath =
        TECH_PATHS[assessment.recommendedPath as keyof typeof TECH_PATHS];
    const completedDate = assessment.completedAt
        ? new Date(assessment.completedAt).toLocaleDateString()
        : "Unknown";

    const handleRetake = async () => {
        setIsRetaking(true);
        try {
            await deleteAssessment({ userId: assessment.userId });
            onRetake();
        } catch (err) {
            console.error("Failed to delete assessment:", err);
            setIsRetaking(false);
        }
    };

    return (
        <div className="w-full max-w-4xl space-y-6">
            {/* Success Alert */}
            <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Assessment Complete!</AlertTitle>
                <AlertDescription className="text-green-700">
                    Based on your answers, we've identified your ideal tech career path.
                </AlertDescription>
            </Alert>

            {/* Recommended Path */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Your Recommended Path
                        <Badge className="ml-auto bg-blue-100 text-blue-800">
                            {recommendedPath.name}
                        </Badge>
                    </CardTitle>
                    <CardDescription>Assessment completed on {completedDate}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        {recommendedPath.description}
                    </p>

                    {/* Path Scores */}
                    <div className="space-y-3 mt-6">
                        <h4 className="font-semibold">Path Match Scores</h4>
                        <div className="grid gap-3">
                            {Object.entries(assessment.pathScores).map(([path, score]) => {
                                const pathInfo =
                                    TECH_PATHS[path as keyof typeof TECH_PATHS];
                                const scoreNum =
                                    ((score as number) * 100) / 1000;
                                return (
                                    <div key={path} className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span>{pathInfo.name}</span>
                                            <span className="font-medium">
                                                {Math.round(
                                                    ((score as number) * 100) / 100
                                                )}
                                                %
                                            </span>
                                        </div>
                                        <Progress
                                            value={scoreNum}
                                            className="h-2"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Path Details */}
            <Card>
                <CardHeader>
                    <CardTitle>What You'll Learn</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Skills */}
                    <div>
                        <h4 className="font-semibold mb-2">Core Skills</h4>
                        <div className="flex flex-wrap gap-2">
                            {recommendedPath.skills.map((skill) => (
                                <Badge key={skill} variant="secondary">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Tools */}
                    <div>
                        <h4 className="font-semibold mb-2">
                            Tools & Technologies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {recommendedPath.tools.map((tool) => (
                                <Badge key={tool} variant="outline">
                                    {tool}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Courses */}
                    <div>
                        <h4 className="font-semibold mb-2">Recommended Courses</h4>
                        <ul className="space-y-2">
                            {recommendedPath.courses.map((course) => (
                                <li
                                    key={course}
                                    className="text-sm text-muted-foreground"
                                >
                                    • {course}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-semibold mb-2">Resources</h4>
                        <ul className="space-y-2">
                            {recommendedPath.resources.map((resource) => (
                                <li
                                    key={resource}
                                    className="text-sm text-muted-foreground"
                                >
                                    • {resource}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Salary */}
                    <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-semibold">
                            Average Salary Range
                        </p>
                        <p className="text-lg font-bold text-green-600 mt-1">
                            {recommendedPath.salaryRange}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Analysis */}
            <Card>
                <CardHeader>
                    <CardTitle>Your Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                        {assessment.analysis}
                    </p>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
                <Button
                    onClick={handleRetake}
                    variant="outline"
                    disabled={isRetaking}
                >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {isRetaking ? "Clearing..." : "Retake Assessment"}
                </Button>
                {onComplete ? (
                    <Button onClick={onComplete}>Continue</Button>
                ) : (
                    <Button asChild>
                        <Link href="/dashboard">View Dashboard</Link>
                    </Button>
                )}
            </div>
        </div>
    );
}
