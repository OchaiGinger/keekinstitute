"use server";

import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { api } from "@/../convex/_generated/api";
import { getConvexClient } from "@/lib/convex-client";

export default async function getSafeProfile() {
  try {
    const authResult = await auth();
    const { userId } = authResult as any;

    if (!userId) {
      return null;
    }

    const clerkUser = await currentUser();
    const userEmail = clerkUser?.emailAddresses?.[0]?.emailAddress || "";

    try {
      const convex = getConvexClient();
      
      // Try to fetch user from Convex using clerkId
      const profile = await convex.query(api.user.getSafeProfile, {
        clerkId: userId,
      });

      if (profile) {
        console.log("[getSafeProfile] Found profile with role:", profile.role);
        return profile;
      }

      // User doesn't exist in Convex, create them as student
      console.log("[getSafeProfile] User not found, creating as student");
      const adminEmail = process.env.ADMIN_EMAIL;
      const isAdmin = adminEmail && userEmail === adminEmail;
      
      const userRole = isAdmin ? "admin" : "student";
      
      try {
        await convex.mutation(api.user.create, {
          clerkId: userId,
          email: userEmail,
          firstName: clerkUser?.firstName || "",
          lastName: clerkUser?.lastName || "",
          role: userRole,
        });
        
        return {
          _id: "" as any,
          clerkId: userId,
          email: userEmail,
          firstName: clerkUser?.firstName || "",
          lastName: clerkUser?.lastName || "",
          role: userRole,
          onboardingCompleted: false,
        };
      } catch (createError) {
        console.log("[getSafeProfile] Could not create user:", createError);
        return null;
      }
    } catch (convexError) {
      console.log("[getSafeProfile] Convex error:", convexError);
      return null;
    }
  } catch (error) {
    console.error("[getSafeProfile] Unexpected error:", error);
    return null;
  }
}
