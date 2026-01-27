"use server";

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getCourses(filters?: {
  title?: string;
  categoryId?: string;
}) {
  try {
    const courses = await convex.query(api.courses.getAll, {});
    // Client-side filtering based on parameters
    let filtered = courses;
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
