"use server";

import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default async function getSafeProfile() {
  try {
    const { userId } = await auth();

    if (!userId) {
      console.log("No user ID from Clerk");
      return null;
    }

    // Call Convex API to get user profile
    const profile = await convex.query(api.user.getSafeProfile, {
      authUserId: userId,
    });

    if (!profile) {
      console.log("Profile not found in Convex for user:", userId);
      // User exists in Clerk but not in Convex - they need to complete onboarding
      // Return a minimal profile to allow access
      return {
        _id: "temp" as any,
        authUserId: userId,
        email: "",
        name: "",
        role: "student",
        onboardingCompleted: false,
      };
    }

    return profile;
  } catch (error) {
    console.error("Error fetching safe profile:", error);
    return null;
  }
}
