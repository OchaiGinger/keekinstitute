import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import HeroContent from "@/components/hero-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const { userId } = await auth();

  // If user is signed in, redirect to dashboard
  if (userId) {
    console.log("[Home] User authenticated, redirecting to dashboard");
    redirect("/dashboard");
  }

  // Show landing page for unsigned users
  return <HeroContent />;
}

