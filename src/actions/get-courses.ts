"use server";

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getCourses(filters?: {
  title?: string;
  categoryId?: string;
}) {
  try {
    const courses = await convex.query(api.courses.getAll, filters || {});
    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}
