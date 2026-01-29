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
      clerkId: authUserId,
    });

    if (!users || users.role !== "admin") {
      throw new Error("Only admins can update user roles");
    }

    // Get the target user by clerkId to get their Convex ID
    const targetUser = await convex.query(api.user.getByClerkId, {
      clerkId: userId,
    });

    if (!targetUser) {
      throw new Error("Target user not found");
    }

    // Update the target user's role
    await convex.mutation(api.user.updateUserProfile, {
      userId: targetUser._id,
      updates: { role: newRole },
    });

    return { success: true };
  } catch (error) {
    console.error("[updateUserRole] Error:", error);
    throw error;
  }
}
