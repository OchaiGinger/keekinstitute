"use client"

import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/../convex/_generated/api"
import { redirect } from "next/navigation"
import { Loader } from "lucide-react"

export default function InstructorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoaded } = useUser()
    const profile = useQuery(
        api.user.getSafeProfile,
        isLoaded && user?.id ? { authUserId: user.id } : "skip"
    )

    if (!isLoaded) return null

    if (!user) {
        redirect("/sign-in")
    }

    // If profile is loading (undefined), show loading state instead of redirecting
    if (profile === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    // If profile exists and role is not instructor, redirect
    if (profile && profile.role !== "instructor") {
        redirect("/")
    }

    // If instructor hasn't completed onboarding, redirect to onboarding
    if (profile && profile.role === "instructor" && !profile.onboardingCompleted) {
        redirect("/onboarding")
    }

    // Just render children - parent dashboard layout handles navbar and sidebar
    return <>{children}</>
}
