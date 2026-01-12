// app/onboarding/page.tsx
import { redirect } from "next/navigation"
import { auth, currentUser } from "@clerk/nextjs/server"
import OnboardingForm from "./_components/onboarding_form"

export default async function OnboardingPage() {
    // Server-side Clerk auth
    // const { userId } = auth()
    // if (!userId) redirect("/") // redirect if not logged in

    // Fetch user info from Clerk
    const user = await currentUser()

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30">
            <OnboardingForm
                initialName={user?.fullName ?? user?.firstName ?? ""}
            />
        </div>
    )
}
