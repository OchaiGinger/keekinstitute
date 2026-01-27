"use server";

import { auth } from "@clerk/nextjs/server";
import { api } from "@/../convex/_generated/api";
import { getConvexClient } from "@/lib/convex-client";
import { redirect } from "next/navigation";
import AssessmentAnalysis from "../_components/assessment_analysis";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AssessmentAnalysisPage() {
    const { userId } = await auth();
    const convex = getConvexClient();

    // Protect: Only logged in users can access
    if (!userId) {
        return redirect("/signup");
    }

    // For this page, we need to get the user record to fetch their assessment
    let userRecord: any = null;
    try {
        userRecord = await convex.query(api.user.getByAuthId, {
            authUserId: userId,
        });
    } catch (error) {
        console.error("Error fetching user:", error);
    }

    if (!userRecord) {
        return redirect("/onboarding");
    }

    return (
        <div className="p-8 max-w-6xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Assessment Analysis</h1>
                <p className="text-muted-foreground">
                    View your assessment results and recommended learning path
                </p>
            </div>

            {/* Assessment Analysis Content */}
            {userRecord ? (
                <div>
                    <AssessmentAnalysis userId={userRecord._id} />

                    {/* Quick Action */}
                    <div className="mt-8">
                        <Link href="/dashboard/student/assessment">
                            <Button>Take / Retake Assessment</Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <p>Loading assessment data...</p>
            )}
        </div>
    );
}
