"use server";

import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default async function getSafeProfile() {
  try {
    // Get auth info from Clerk with timeout handling
    let authResult;
    try {
      authResult = await Promise.race([
        auth(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Auth timeout")), 5000)
        )
      ]);
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

    try {
      // Try to fetch actual user profile from Convex
      const profile = await convex.query(api.user.getSafeProfile, {
        authUserId: userId,
      });

      if (profile) {
        console.log("[getSafeProfile] Found profile in Convex");
        return profile;
      }

      // User not found in Convex - create them
      console.log("[getSafeProfile] User not found in Convex, creating new user...");
      try {
        await convex.mutation(api.user.create, {
          authUserId: userId,
          email: "",
          name: "",
          role: "student",
        });
        console.log("[getSafeProfile] User created successfully");
        // Return minimal profile after creating user
        return {
          _id: "" as any,
          authUserId: userId,
          email: "",
          name: "",
          role: "student",
          onboardingCompleted: false,
        };
      } catch (createError) {
        console.log("[getSafeProfile] Could not create user in Convex:", createError);
      }
    } catch (convexError) {
      console.log("[getSafeProfile] Could not fetch from Convex, will try to create user");
      // Try to create user if fetch failed
      try {
        await convex.mutation(api.user.create, {
          authUserId: userId,
          email: "",
          name: "",
          role: "student",
        });
        console.log("[getSafeProfile] User created successfully");
        // Return minimal profile after creating user
        return {
          _id: "" as any,
          authUserId: userId,
          email: "",
          name: "",
          role: "student",
          onboardingCompleted: false,
        };
      } catch (createError) {
        console.log("[getSafeProfile] Could not create user in Convex:", createError);
      }
    }

    // Return a basic profile if Convex not available
    // This allows user to proceed even if Convex dev server isn't running
    console.log("[getSafeProfile] Returning minimal profile for userId:", userId);
    return {
      _id: "" as any,
      authUserId: userId,
      email: "",
      name: "",
      role: "student",
      onboardingCompleted: false,
    };
  } catch (error) {
    console.error("[getSafeProfile] Unexpected error:", error);
    return null;
  }
}
