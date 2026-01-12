"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { TECH_PATHS } from "@/app/assessment/questions";
import AssessmentModal from "./assessment_modal";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Eye } from "lucide-react";

interface AssessmentAnalysisProps {
    userId: Id<"users">;
}

export default function AssessmentAnalysis({
    userId,
}: AssessmentAnalysisProps) {
    const [modalOpen, setModalOpen] = useState(false);

    const latestAssessment = useQuery(
        api.assessment.getLatestAssessmentByUserId,
        { userId }
    );

    if (latestAssessment === undefined) {
        return null; // loading
    }

    if (!latestAssessment) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Tech Career Path Assessment</CardTitle>
                    <CardDescription>
                        Discover which tech path is best suited for you.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/assessment">
                        <Button>Take Assessment</Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    const { recommendedPath, completedAt } = latestAssessment;
    const pathInfo = TECH_PATHS[recommendedPath as keyof typeof TECH_PATHS];

    const completedDate = completedAt
        ? new Date(completedAt).toLocaleDateString()
        : "Unknown";

    return (
        <>
            <AssessmentModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                assessment={latestAssessment}
            />

            <Card>
                <CardHeader>
                    <CardTitle>Your Tech Career Path</CardTitle>
                    <CardDescription>
                        Assessment completed on {completedDate}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Recommended Path */}
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground font-medium mb-1">
                                    Recommended Path
                                </p>
                                <h3 className="text-lg font-semibold">
                                    {pathInfo.name}
                                </h3>
                            </div>
                            <Badge className="bg-blue-600">{pathInfo.name}</Badge>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground">
                        {pathInfo.description}
                    </p>

                    {/* Skills */}
                    <div>
                        <h4 className="text-sm font-semibold mb-2">Core Skills</h4>
                        <div className="flex flex-wrap gap-2">
                            {pathInfo.skills.slice(0, 4).map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                    {skill}
                                </Badge>
                            ))}
                            {pathInfo.skills.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                    +{pathInfo.skills.length - 4} more
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Salary */}
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-xs font-medium text-green-900 mb-1">
                            Average Salary Range
                        </p>
                        <p className="text-lg font-bold text-green-700">
                            {pathInfo.salaryRange}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1 h-9"
                            onClick={() => setModalOpen(true)}
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            Full Analysis
                        </Button>

                        <Link href="/assessment" className="flex-1">
                            <Button variant="outline" className="w-full h-9">
                                Retake
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
