"use server";

import { auth } from "@clerk/nextjs/server";
import { api } from "@/../convex/_generated/api";
import { getConvexClient } from "@/lib/convex-client";

/**
 * Validates that the authenticated user still exists in the database
 * This is used after a user might have been deleted by an admin
 * Does NOT create a new user if they don't exist
 */
export async function validateUserExists() {
  try {
    const authResult = await auth();
    const { userId } = authResult as any;

    if (!userId) {
      return null;
    }

    const convex = getConvexClient();
    
    // Query to check if user exists - this won't create them
    const profile = await convex.query(api.user.getByClerkId, {
      clerkId: userId,
    });

    if (!profile) {
      console.log("[validateUserExists] User deleted - returning null");
      return null;
    }

    return profile;
  } catch (error) {
    console.error("[validateUserExists] Error:", error);
    return null;
  }
}
