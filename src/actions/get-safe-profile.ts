"use server";

import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { api } from "@/../convex/_generated/api";
import { getConvexClient } from "@/lib/convex-client";

export default async function getSafeProfile() {
  try {
    // Get auth info from Clerk with timeout handling
    let authResult;
    let clerkUser;
    try {
      authResult = await Promise.race([
        auth(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Auth timeout")), 5000)
        )
      ]);
      
      // Also get the current user to access email
      clerkUser = await currentUser();
    } catch (authError) {
      console.log("[getSafeProfile] Auth call failed or timed out:", (authError as Error).message);
      // Return null to let page load - Clerk will initialize on client if needed
      return null;
    }

    const { userId, sessionId } = authResult as any;

    console.log("[getSafeProfile] Auth check - userId:", userId ? "✓" : "✗", "sessionId:", sessionId ? "✓" : "✗");

    if (!userId) {
      console.log("[getSafeProfile] No user ID from Clerk - returning null");
      return null;
    }

    // Check if user is admin by comparing email with env variable
    const adminEmail = process.env.ADMIN_EMAIL;
    const userEmail = clerkUser?.emailAddresses?.[0]?.emailAddress || "";
    const isAdmin = adminEmail && userEmail === adminEmail;

    console.log("[getSafeProfile] Email check - userEmail:", userEmail, "isAdmin:", isAdmin);

    try {
      // Try to fetch actual user profile from Convex
      const convex = getConvexClient();
      const profile = await convex.query(api.user.getSafeProfile, {
        authUserId: userId,
      });

      if (profile) {
        console.log("[getSafeProfile] Found profile in Convex with role:", profile.role);
        
        // Only override role if user is admin (by email)
        // Otherwise preserve existing role (instructor, student, etc)
        const expectedRole = isAdmin ? "admin" : profile.role;
        if (profile.role !== expectedRole) {
          console.log("[getSafeProfile] Admin status changed - current:", profile.role, "expected:", expectedRole);
          // Update role in memory
          profile.role = expectedRole;
          console.log("[getSafeProfile] Updated profile role in memory to:", expectedRole);
        }
        return profile;
      }

      // User not found in Convex - create them
      console.log("[getSafeProfile] User not found in Convex, creating new user...");
      const userRole = isAdmin ? "admin" : "student";
      try {
        await convex.mutation(api.user.create, {
          authUserId: userId,
          email: userEmail,
          name: clerkUser?.firstName || "",
          role: userRole,
        });
        console.log("[getSafeProfile] User created successfully with role:", userRole);
        // Return minimal profile after creating user
        return {
          _id: "" as any,
          authUserId: userId,
          email: userEmail,
          name: clerkUser?.firstName || "",
          role: userRole,
          onboardingCompleted: false,
        };
      } catch (createError) {
        console.log("[getSafeProfile] Could not create user in Convex:", createError);
      }
    } catch (convexError) {
      console.log("[getSafeProfile] Could not fetch from Convex, will try to create user");
      // Try to create user if fetch failed
      const userRole = isAdmin ? "admin" : "student";
      try {
        await convex.mutation(api.user.create, {
          authUserId: userId,
          email: userEmail,
          name: clerkUser?.firstName || "",
          role: userRole,
        });
        console.log("[getSafeProfile] User created successfully with role:", userRole);
        // Return minimal profile after creating user
        return {
          _id: "" as any,
          authUserId: userId,
          email: userEmail,
          name: clerkUser?.firstName || "",
          role: userRole,
          onboardingCompleted: false,
        };
      } catch (createError) {
        console.log("[getSafeProfile] Could not create user in Convex:", createError);
      }
    }

    // Return a basic profile if Convex not available
    // This allows user to proceed even if Convex dev server isn't running
    console.log("[getSafeProfile] Returning minimal profile for userId:", userId);
    const fallbackRole = isAdmin ? "admin" : "student";
    return {
      _id: "" as any,
      authUserId: userId,
      email: userEmail,
      name: clerkUser?.firstName || "",
      role: fallbackRole,
      onboardingCompleted: false,
    };
  } catch (error) {
    console.error("[getSafeProfile] Unexpected error:", error);
    return null;
  }
}
