"use server";

import { auth } from "@clerk/nextjs/server";
import { api } from "@/../convex/_generated/api";
import { getConvexClient } from "@/lib/convex-client";
import { redirect } from "next/navigation";

export async function handleGetStarted() {
  try {
    const { userId } = await auth();

    if (!userId) {
      // User not signed in - redirect to signup
      return redirect("/signup");
    }

    // User is signed in - redirect to dashboard
    // The dashboard layout will check onboarding status and route accordingly
    return redirect("/dashboard");
  } catch (error) {
    console.error("[handleGetStarted] Auth error:", error);
    // If auth fails, redirect to signup
    return redirect("/signup");
  }
}
