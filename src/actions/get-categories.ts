"use server";

import { api } from "@/../convex/_generated/api";
import { getConvexClient } from "@/lib/convex-client";

export async function getCategories() {
  try {
    const convex = getConvexClient();
    const categories = await convex.query(api.categories.getAll, {});
    return categories.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
