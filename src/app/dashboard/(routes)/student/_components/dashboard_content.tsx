"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";
import AssessmentAnalysis from "./assessment_analysis";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface DashboardContentProps {
    userId: string;
    userName: string;
    userEmail: string;
}

export default function DashboardContent({ userId, userName, userEmail }: DashboardContentProps) {
    const router = useRouter();
    const [convexUserId, setConvexUserId] = useState<Id<"users"> | null>(null);

    // Fetch Convex user record
    const userRecord = useQuery(
        api.user.getByClerkId,
        userId ? { clerkId: userId } : "skip"
    );

    // Create user mutation
    const createUser = useMutation(api.user.create);

    // Handle user creation and onboarding redirect
    useEffect(() => {
        if (!userRecord || userRecord === undefined) return;

        if (userRecord === null) {
            // User doesn't exist in Convex, create them
            createUser({
                clerkId: userId,
                email: userEmail,
                firstName: userName,
            }).then(() => {
                router.push("/student-onboarding");
            });
            return;
        }

        // User exists, check if onboarding is complete
        if (!userRecord.onboardingCompleted) {
            router.push("/onboarding");
            return;
        }

        // User is fully set up
        setConvexUserId(userRecord._id);
    }, [userRecord, userId, userEmail, userName, createUser, router]);

    // Show loading state while checking user
    if (!convexUserId) {
        return null;
    }

    return (
        <div className="p-8">
            {/* User Info */}
            <div className="mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Logged in as {userName} ({userEmail})
                    </p>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Assessment Section */}
                <div className="lg:col-span-2">
                    <AssessmentAnalysis userId={convexUserId} />
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <div className="border rounded-lg p-6 bg-linear-to-br from-blue-50 to-indigo-50">
                        <h3 className="font-semibold mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <Link href="/dashboard/student/assessment">
                                <Button className="w-full">Take / Retake Assessment</Button>
                            </Link>
                            <Link href="/dashboard/student/courses">
                                <Button className="w-full" variant="outline">
                                    Browse Courses
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button className="w-full" variant="outline">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="border rounded-lg p-6">
                        <h3 className="font-semibold mb-4">Profile Stats</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Assessments Taken</span>
                                <span className="font-semibold">1</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Courses Enrolled</span>
                                <span className="font-semibold">0</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Learning Streak</span>
                                <span className="font-semibold">0 days</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
