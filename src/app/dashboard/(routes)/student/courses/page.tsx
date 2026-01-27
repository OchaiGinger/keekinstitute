"use server";

import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/../convex/_generated/api";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

export default async function CoursesPage() {
    const { userId } = await auth();

    // Protect: Only logged in users can access
    if (!userId) {
        return redirect("/signup");
    }

    // Fetch published courses
    let courses: any[] = [];
    try {
        courses = await convex.query(api.courses.getPublished);
    } catch (error) {
        console.error("Error fetching courses:", error);
    }

    return (
        <div className="p-8 max-w-6xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Browse Courses</h1>
                <p className="text-muted-foreground">
                    Explore and enroll in courses to expand your skills
                </p>
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
