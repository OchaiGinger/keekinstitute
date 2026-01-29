"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Loader } from "lucide-react";
import AssessmentForm from "./_components/assessment_form";
import AssessmentResults from "./_components/assessment_results";

export default function AssessmentPage() {
    const router = useRouter();
    const { userId } = useAuth();
    const { isSignedIn, isLoaded } = useUser();

    // Fetch user record to get userId
    const userRecord = useQuery(
        api.user.getByClerkId,
        userId ? { clerkId: userId } : "skip"
    );

    // Fetch latest assessment if user exists
    const latestAssessment = useQuery(
        api.assessment.getLatestAssessmentByUserId,
        userRecord ? { userId: userRecord._id as any } : "skip"
    );

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push("/signup");
        }
    }, [isLoaded, isSignedIn, router]);

    if (!isLoaded || userRecord === undefined || latestAssessment === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30">
                <Loader className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!isSignedIn) {
        return null;
    }

    // If user has completed an assessment, show results with option to retake
    if (userRecord && latestAssessment) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
                <AssessmentResults
                    assessment={latestAssessment}
                    onRetake={() => window.location.reload()}
                    isFromExisting={true}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <AssessmentForm />
        </div>
    );
}
