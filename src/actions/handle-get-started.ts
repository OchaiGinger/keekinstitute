"use server";

import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { redirect } from "next/navigation";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function handleGetStarted() {
  const { userId } = await auth();

  if (!userId) {
    // User not signed in - redirect to signup
    return redirect("/signup");
  }

  // User is signed in - redirect to dashboard
  // The dashboard layout will check onboarding status and route accordingly
  return redirect("/dashboard");
}
