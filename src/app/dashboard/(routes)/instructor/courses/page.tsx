"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

const CoursesPage = () => {
    const { user } = useUser();

    const courses = useQuery(api.courses.getAll);

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">My Courses</h1>
                <Link href="/dashboard/instructor/create">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Course
                    </Button>
                </Link>
            </div>

            {courses === undefined ? (
                <div className="flex justify-center items-center h-40">
                    <p className="text-muted-foreground">Loading courses...</p>
                </div>
            ) : courses && courses.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                        <Card key={course._id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between gap-2">
                                    <CardTitle className="line-clamp-2 flex-1">{course.title}</CardTitle>
                                    <Badge variant={course.isPublished ? "default" : "secondary"}>
                                        {course.isPublished ? "Published" : "Draft"}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                    {course.description || "No description"}
                                </p>
                                <div className="flex gap-2">
                                    <Link href={`/dashboard/instructor/courses/${course._id}`} className="flex-1">
                                        <Button variant="outline" className="w-full">
                                            Edit
                                        </Button>
                                    </Link>
                                    {course.isPublished && (
                                        <Link href={`/courses/${course._id}`} className="flex-1">
                                            <Button variant="outline" className="w-full">
                                                View
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-12">
                            <p className="text-muted-foreground mb-4">
                                You haven't created any courses yet
                            </p>
                            <Link href="/dashboard/instructor/create">
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Your First Course
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default CoursesPage;