"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Users, BarChart3, Settings } from "lucide-react";

export default function InstructorPage() {
    const { user } = useUser();

    const profile = useQuery(
        api.user.getSafeProfile,
        user?.id ? { authUserId: user.id } : "skip"
    );

    const courses = useQuery(api.courses.getPublished);

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Welcome back, {profile?.name}
                </h1>
                <p className="text-muted-foreground mt-2">
                    Manage your courses, students, and track your teaching analytics
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{courses?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">Active courses</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Total enrolled</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">—</div>
                        <p className="text-xs text-muted-foreground">From reviews</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Create Course */}
                <Link href="/dashboard/instructor/create">
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Plus className="h-5 w-5 text-blue-600" />
                                <CardTitle className="text-lg">Create Course</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Create a new course and start teaching
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                {/* My Courses */}
                <Link href="/dashboard/instructor/courses">
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-purple-600" />
                                <CardTitle className="text-lg">My Courses</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                View and manage all your courses
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                {/* Students */}
                <Link href="/dashboard/instructor/users">
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-green-600" />
                                <CardTitle className="text-lg">Students</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                View student list and progress
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                {/* Analytics */}
                <Link href="/dashboard/instructor/analyticss">
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-orange-600" />
                                <CardTitle className="text-lg">Analytics</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                View revenue and course statistics
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Primary Action */}
            <div className="pt-4">
                <Link href="/dashboard/instructor/create">
                    <Button size="lg" className="w-full md:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Course
                    </Button>
                </Link>
            </div>
        </div>
    );
}
