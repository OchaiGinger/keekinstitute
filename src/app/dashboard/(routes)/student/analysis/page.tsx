"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import AssessmentAnalysis from "../_components/assessment_analysis";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AssessmentAnalysisPage() {
    const router = useRouter();
    const { isSignedIn, user } = useUser();

    const [localUserId, setLocalUserId] = useState<string | null>(null);

    // Get Convex user record
    const userRecord = useQuery(
        api.user.getByAuthId,
        localUserId ? { authUserId: localUserId } : "skip"
    );

    // Create user mutation
    const createUser = useMutation(api.user.create);

    useEffect(() => {
        if (!isSignedIn) return;
        if (!user) return;

        setLocalUserId(user.id);
    }, [isSignedIn, user]);

    useEffect(() => {
        if (!isSignedIn || !userRecord || !localUserId) return;

        if (userRecord === undefined) return;

        if (userRecord === null) {
            const email =
                user?.primaryEmailAddress?.emailAddress ??
                user?.emailAddresses?.[0]?.emailAddress ??
                "";
            const name = user?.fullName ?? user?.firstName ?? undefined;

            createUser({ authUserId: localUserId, email, name })
                .then(() => router.push("/onboarding"))
                .catch(console.error);

            return;
        }

        if (!userRecord.onboardingCompleted) {
            router.push("/onboarding");
        }
    }, [isSignedIn, userRecord, localUserId, user, createUser, router]);

    if (!isSignedIn) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl w-full">
                    <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition">
                        <h2 className="text-xl font-semibold mb-2">Welcome back</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                            Already have an account? Sign in to continue.
                        </p>
                        <SignInButton mode="modal">
                            <button className="w-full px-4 py-2 bg-primary text-white rounded-lg">
                                Sign In
                            </button>
                        </SignInButton>
                    </div>

                    <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition">
                        <h2 className="text-xl font-semibold mb-2">New here?</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                            Create an account to get started.
                        </p>
                        <SignInButton mode="modal" signUpForceRedirectUrl="/onboarding">
                            <button className="w-full px-4 py-2 bg-secondary text-white rounded-lg">
                                Sign Up
                            </button>
                        </SignInButton>
                    </div>
                </div>
            </div>
        );
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
                        <Link href="/assessment">
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
