import { redirect } from "next/navigation"

export default async function OnboardingPage() {
    // This route no longer exists - redirect to home
    redirect("/")
}
