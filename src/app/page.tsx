import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import HeroContent from "@/components/hero-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    const { userId } = await auth();

    // If user is signed in, redirect to dashboard
    // Dashboard layout will handle role-based routing and onboarding checks
    if (userId) {
      return redirect("/dashboard");
    }
  } catch (error) {
    console.log("[Home] Auth check failed, showing landing page");
    // Auth failed or not ready - show landing page anyway
  }

  // Show landing page for unsigned users or when auth fails
  return <HeroContent />;
}

