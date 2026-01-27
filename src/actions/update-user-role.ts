"use server";

import { auth } from "@clerk/nextjs/server";
import { api } from "@/../convex/_generated/api";
import { getConvexClient } from "@/lib/convex-client";

export async function updateUserRole(userId: string, newRole: "admin" | "instructor" | "student") {
  try {
    const { userId: authUserId } = await auth();
    
    if (!authUserId) {
      throw new Error("Not authenticated");
    }

    const convex = getConvexClient();
    
    // Get the current user to verify they're admin
    const users = await convex.query(api.user.getSafeProfile, {
      authUserId,
    });

    if (!users || users.role !== "admin") {
      throw new Error("Only admins can update user roles");
    }

    // Update the target user's role
    await convex.mutation(api.user.updateUserProfile, {
      userId,
      updates: { role: newRole },
    });

    return { success: true };
  } catch (error) {
    console.error("[updateUserRole] Error:", error);
    throw error;
  }
}
