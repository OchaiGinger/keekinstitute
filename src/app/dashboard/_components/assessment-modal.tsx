"use client";

import { TECH_PATHS } from "@/app/assessment/questions";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface AssessmentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    assessment: any;
}

export default function AssessmentModal({
    open,
    onOpenChange,
    assessment,
}: AssessmentModalProps) {
    if (!assessment) return null;

    const recommendedPath =
        TECH_PATHS[assessment.recommendedPath as keyof typeof TECH_PATHS];
    const completedDate = assessment.completedAt
        ? new Date(assessment.completedAt).toLocaleDateString()
        : "Unknown";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Your Tech Career Path Assessment</DialogTitle>
                    <DialogDescription>
                        Assessment completed on {completedDate}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Recommended Path */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold">
                                Recommended Path
                            </h3>
                            <Badge className="bg-blue-600">
                                {recommendedPath.name}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {recommendedPath.description}
                        </p>
                    </div>

                    {/* Path Scores */}
                    <div className="space-y-3">
                        <h4 className="font-semibold">Path Match Scores</h4>
                        <div className="grid gap-3">
                            {Object.entries(assessment.pathScores).map(
                                ([path, score]) => {
                                    const pathInfo =
                                        TECH_PATHS[
                                        path as keyof typeof TECH_PATHS
                                        ];
                                    const scoreNum =
                                        ((score as number) * 100) / 1000;
                                    return (
                                        <div key={path} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span>
                                                    {pathInfo.name}
                                                </span>
                                                <span className="font-medium">
                                                    {Math.round(
                                                        ((score as number) *
                                                            100) /
                                                        100
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
                                }
                            )}
                        </div>
                    </div>

                    {/* Skills */}
                    <div>
                        <h4 className="font-semibold mb-2">Core Skills</h4>
                        <div className="flex flex-wrap gap-2">
                            {recommendedPath.skills.map((skill) => (
                                <Badge
                                    key={skill}
                                    variant="secondary"
                                    className="text-xs"
                                >
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
                                <Badge
                                    key={tool}
                                    variant="outline"
                                    className="text-xs"
                                >
                                    {tool}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Salary */}
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm font-semibold text-green-900 mb-1">
                            Average Salary Range
                        </p>
                        <p className="text-xl font-bold text-green-700">
                            {recommendedPath.salaryRange}
                        </p>
                    </div>

                    {/* Analysis */}
                    {assessment.analysis && (
                        <div className="space-y-2">
                            <h4 className="font-semibold">Analysis</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {assessment.analysis}
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
