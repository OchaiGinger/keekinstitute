"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CoursesPage() {
    const router = useRouter();
    const { isSignedIn, user } = useUser();

    const [localUserId, setLocalUserId] = useState<string | null>(null);

    // Get Convex user record
    const userRecord = useQuery(
        api.user.getByAuthId,
        localUserId ? { authUserId: localUserId } : "skip"
    );

    // Fetch all published courses
    const courses = useQuery(api.courses.getPublished);

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
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Browse Courses</h1>
                    <p className="text-muted-foreground">
                        Explore and enroll in courses to expand your skills
                    </p>
                </div>
                <UserButton />
            </div>

            {/* Courses Grid */}
            {courses && courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <Card key={course._id} className="overflow-hidden hover:shadow-lg transition">
                            {course.imageUrl && (
                                <div className="w-full h-48 bg-linear-to-br from-blue-400 to-blue-600 overflow-hidden">
                                    <img
                                        src={course.imageUrl}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-4">
                                <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                    {course.description || "No description available"}
                                </p>
                                <Link href={`/courses/${course._id}`}>
                                    <Button className="w-full" variant="outline">
                                        View Course
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No courses available yet</p>
                    <p className="text-sm text-muted-foreground">Check back soon for new courses!</p>
                </div>
            )}
        </div>
    );
}
