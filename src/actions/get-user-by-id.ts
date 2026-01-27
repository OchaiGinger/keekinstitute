"use server";

import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { getConvexClient } from "@/lib/convex-client";

export async function getUserById(userId: string) {
  try {
    const convex = getConvexClient();
    const user = await convex.query(api.user.getById, {
      userId: userId as Id<"users">,
    });
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
