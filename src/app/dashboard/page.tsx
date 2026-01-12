"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import AssessmentAnalysis from "./_components/assessment_analysis";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const router = useRouter();
    const { isSignedIn, user } = useUser();

    const [localUserId, setLocalUserId] = useState<string | null>(null);

    // 1️⃣ Get Convex user record
    const userRecord = useQuery(
        api.user.getByAuthId,
        localUserId ? { authUserId: localUserId } : "skip"
    );

    // 2️⃣ Create user mutation
    const createUser = useMutation(api.user.create);

    // 3️⃣ Fetch user authId from Clerk after login
    useEffect(() => {
        if (!isSignedIn) return;
        if (!user) return;

        const authId =
            user.primaryEmailAddress?.emailAddress ??
            user.emailAddresses?.[0]?.emailAddress ??
            "";

        setLocalUserId(user.id); // Clerk user ID
    }, [isSignedIn, user]);

    // 4️⃣ Handle onboarding + creation
    useEffect(() => {
        if (!isSignedIn || !userRecord || !localUserId) return;

        // Loading state
        if (userRecord === undefined) return;

        // User not in DB → create and redirect
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

        // User exists → check onboarding
        if (!userRecord.onboardingCompleted) {
            router.push("/onboarding");
        }
    }, [isSignedIn, userRecord, localUserId, user, createUser, router]);

    // 5️⃣ Loading / Not signed in
    if (!isSignedIn) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl w-full">
                    {/* Sign In */}
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

                    {/* Sign Up */}
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

    // 6️⃣ Render Dashboard once user is loaded
    return (
        <div className="p-8">
            {/* User Info */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Logged in as {user?.fullName ?? user?.firstName} ({user?.primaryEmailAddress?.emailAddress ??
                            user?.emailAddresses?.[0]?.emailAddress})
                    </p>
                </div>
                <UserButton />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Assessment Section */}
                <div className="lg:col-span-2">
                    {userRecord ? (
                        <AssessmentAnalysis userId={userRecord._id} />
                    ) : (
                        <p>Loading user data...</p>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <div className="border rounded-lg p-6 bg-linear-to-br from-blue-50 to-indigo-50">
                        <h3 className="font-semibold mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <Link href="/assessment">
                                <Button className="w-full">Take / Retake Assessment</Button>
                            </Link>
                            <Link href="/courses">
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
                                <span className="font-semibold">{userRecord?._id ? "1" : "0"}</span>
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
