"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ArrowRight } from "lucide-react";

export default function StudentPage() {
    const router = useRouter();
    const { isSignedIn, user } = useUser();
    const [localUserId, setLocalUserId] = useState<string | null>(null);

    // Get Convex user record
    const userRecord = useQuery(
        api.user.getByAuthId,
        localUserId ? { authUserId: localUserId } : "skip"
    );

    // Get enrolled courses
    const enrolledCourses = useQuery(
        api.enrollments.getByUser,
        userRecord?._id ? { userId: userRecord._id as any } : "skip"
    );

    useEffect(() => {
        if (!isSignedIn || !user) return;
        setLocalUserId(user.id);
    }, [isSignedIn, user]);

    useEffect(() => {
        if (!isSignedIn || !userRecord || !localUserId) return;
        if (userRecord === undefined) return;

        if (userRecord === null) {
            router.push("/onboarding");
            return;
        }

        if (!userRecord.onboardingCompleted) {
            router.push("/onboarding");
        }
    }, [isSignedIn, userRecord, localUserId, router]);

    return (
        <div className="p-8 max-w-6xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Welcome, {user?.firstName}!</h1>
                <p className="text-muted-foreground">
                    Continue learning with your enrolled courses
                </p>
            </div>

            {/* Enrolled Courses Section */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <BookOpen className="h-6 w-6" />
                            Your Courses
                        </h2>
                    </div>
                    <Link href="/dashboard/student/courses">
                        <Button variant="outline">
                            Browse All Courses
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </Link>
                </div>

                {enrolledCourses === undefined ? (
                    <div className="flex justify-center items-center h-40">
                        <p className="text-muted-foreground">Loading your courses...</p>
                    </div>
                ) : enrolledCourses && enrolledCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrolledCourses.map((enrollment: any) => {
                            const course = enrollment.course;
                            return (
                                <Card key={enrollment._id} className="overflow-hidden hover:shadow-lg transition">
                                    {course.imageUrl && (
                                        <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden">
                                            <img
                                                src={course.imageUrl}
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <CardHeader>
                                        <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                            {course.description || "No description available"}
                                        </p>
                                        <div className="flex gap-2">
                                            <Link href={`/courses/${course._id}`} className="flex-1">
                                                <Button className="w-full" variant="outline" size="sm">
                                                    Continue Learning
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center py-12">
                                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground mb-4">
                                    You haven't enrolled in any courses yet
                                </p>
                                <Link href="/dashboard/student/courses">
                                    <Button>
                                        Explore Courses
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Check your assessment results and learning path
                        </p>
                        <Link href="/dashboard/student/analysis">
                            <Button variant="outline" className="w-full">
                                View Analysis
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Browse Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Discover more courses to expand your skills
                        </p>
                        <Link href="/dashboard/student/courses">
                            <Button variant="outline" className="w-full">
                                Browse All
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}