"use server";

import { api } from "@/../convex/_generated/api";
import { getConvexClient } from "@/lib/convex-client";

export async function getCourses(filters?: {
  title?: string;
  categoryId?: string;
}) {
  try {
    const convex = getConvexClient();
    const courses = await convex.query(api.courses.getAll, {});
    // Client-side filtering based on parameters
    let filtered = courses.map(course => ({
      ...course,
      id: course._id.toString(),
    }));
    if (filters?.title) {
      filtered = filtered.filter(course =>
        course.title?.toLowerCase().includes(filters.title!.toLowerCase())
      );
    }
    if (filters?.categoryId) {
      filtered = filtered.filter(course => course.categoryId === filters.categoryId);
    }
    return filtered;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}
