import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import HeroContent from "@/components/hero-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    const { userId } = await auth();

    // If user is signed in, redirect to dashboard
    if (userId) {
      return redirect("/dashboard");
    }
  } catch (error) {
    // Silently handle auth errors on public page
    // This happens when Clerk is not fully initialized or env vars are missing
  }

  // Show landing page for unsigned users
  return <HeroContent />;
}

