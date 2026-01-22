// app/onboarding/page.tsx
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import OnboardingForm from "./_components/onboarding_form"
import getSafeProfile from "@/actions/get-safe-profile"

// Mark as dynamic since it uses Clerk auth and real-time data
export const dynamic = "force-dynamic"

export default async function OnboardingPage() {
    // Fetch user info from Clerk
    const user = await currentUser()

    if (!user) redirect("/")

    // Check if user has already completed onboarding
    const profile = await getSafeProfile()

    // If instructor has completed onboarding, redirect to instructor dashboard
    if (profile && profile.role === "instructor" && profile.onboardingCompleted) {
        redirect("/instructor")
    }

    // If any other user (student/admin) has completed onboarding, redirect to dashboard
    if (profile && profile.onboardingCompleted && profile.role !== "instructor") {
        redirect("/dashboard")
    }

    const initialName = user?.fullName ?? user?.firstName ?? ""
    const email = user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? ""
    const clerkUserId = user.id

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30">
            <OnboardingForm
                initialName={initialName}
                userEmail={email}
                clerkUserId={clerkUserId}
            />
        </div>
    )
}
