"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function handleGetStarted() {
  try {
    const authResult = await auth();
    const userId = authResult?.userId;
    
    console.log("[handleGetStarted] userId:", userId);

    if (!userId) {
      // User not signed in - redirect to signup
      console.log("[handleGetStarted] No userId, redirecting to signup");
      return redirect("/signup");
    }

    // User is signed in - redirect to dashboard
    // The dashboard layout will check onboarding status and route accordingly
    console.log("[handleGetStarted] UserId found, redirecting to dashboard");
    return redirect("/dashboard");
  } catch (error) {
    console.error("[handleGetStarted] Auth error:", error);
    // If auth fails, redirect to signup
    return redirect("/signup");
  }
}
