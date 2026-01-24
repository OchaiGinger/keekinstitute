"use client";

import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { use } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, PlayCircle, Clock, Users } from "lucide-react";
import Image from "next/image";

const CourseViewPage = ({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) => {
    const { courseId } = use(params);

    const course = useQuery(api.courses.getById, courseId ? {
        courseId: courseId as any,
    } : "skip");

    const chapters = useQuery(api.chapters.getByCourse, courseId ? {
        courseId: courseId as any,
    } : "skip");

    if (course === undefined || chapters === undefined) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-muted-foreground">Loading course...</p>
                </div>
            </div>
        );
    }

    if (!course || !course.isPublished) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <p className="text-2xl font-semibold">Course not found</p>
                <p className="text-muted-foreground">This course is not available or has been removed.</p>
                <Link href="/dashboard/student/courses">
                    <Button>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Courses
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="border-b bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <Link href="/dashboard/student/courses">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2">
                        {/* Course Image */}
                        {course.imageUrl && (
                            <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
                                <Image
                                    src={course.imageUrl}
                                    alt={course.title}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                        )}

                        {/* Course Title and Description */}
                        <h1 className="text-4xl font-bold mb-4">{course.title}</h1>

                        <p className="text-xl text-muted-foreground mb-6">
                            {course.description}
                        </p>

                        {/* Course Info */}
                        <div className="flex gap-6 mb-8 flex-wrap">
                            {course.price && (
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold">${course.price.toFixed(2)}</span>
                                </div>
                            )}
                            {chapters && chapters.length > 0 && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <PlayCircle className="h-5 w-5" />
                                    <span>{chapters.length} chapters</span>
                                </div>
                            )}
                        </div>

                        {/* Course Type and Target Students */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 border">
                            <h2 className="text-lg font-semibold mb-4">Course Details</h2>

                            {course.courseType && (
                                <div className="mb-4">
                                    <p className="text-sm text-muted-foreground">Course Type</p>
                                    <p className="font-medium">{course.courseType}</p>
                                </div>
                            )}

                            {course.targetStudentType && course.targetStudentType.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-sm text-muted-foreground">Target Audience</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {course.targetStudentType.map((type) => (
                                            <span key={type} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                                                {type === "KeekInstitute" ? "Kee Institute Students" : type === "External" ? "External Students (Polytechnic)" : "IT Students"}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Chapters List */}
                        {chapters && chapters.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
                                <h2 className="text-lg font-semibold mb-4">Course Content</h2>
                                <div className="space-y-2">
                                    {chapters.map((chapter) => (
                                        <div key={chapter._id} className="border-b last:border-b-0 pb-4 last:pb-0">
                                            <div className="flex items-start gap-4">
                                                <PlayCircle className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                                                <div className="flex-1">
                                                    <h3 className="font-medium">{chapter.title}</h3>
                                                    {chapter.description && (
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {chapter.description}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                                        {chapter.videoUrl && (
                                                            <span className="flex items-center gap-1">
                                                                <PlayCircle className="h-4 w-4" />
                                                                Video
                                                            </span>
                                                        )}
                                                        {chapter.isFree && (
                                                            <span className="text-green-600 dark:text-green-400 font-medium">
                                                                Free Preview
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {!chapter.isPublished && (
                                                    <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                                                        Coming Soon
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Enrollment */}
                    <div className="md:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border sticky top-24">
                            <h3 className="text-lg font-semibold mb-4">Enrollment</h3>

                            <Button className="w-full mb-4" size="lg">
                                Enroll Now
                            </Button>

                            <div className="space-y-3 text-sm">
                                {course.price === 0 || course.price === null ? (
                                    <p className="text-green-600 dark:text-green-400 font-medium">Free Course</p>
                                ) : (
                                    <p className="text-muted-foreground">
                                        Price: <span className="font-semibold">${(course.price || 0).toFixed(2)}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseViewPage;
