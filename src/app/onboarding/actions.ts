"use server"

import { z } from "zod"
import { ConvexHttpClient } from "convex/browser"
import { api } from "../../../convex/_generated/api"

// Zod schema for onboarding
const onboardingSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
})

type OnboardingFormData = z.infer<typeof onboardingSchema>

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function completeOnboardingAction(
    data: OnboardingFormData,
    clerkUserId: string,
    userEmail: string
) {
    try {
        // Validate with Zod
        const validated = onboardingSchema.parse(data)

        // First, get the user's role from email lookup
        const userByEmail = await convex.query(api.user.getByEmail, {
            email: userEmail,
        })

        // Call Convex mutation via ConvexHttpClient
        const result = await convex.mutation(api.user.completeOnboarding, {
            authUserId: clerkUserId,
            email: userEmail,
            name: validated.name,
            role: userByEmail?.role, // Pass the role from email lookup
        })

        return { success: true, data: result, error: "" }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                data: null,
                error: error.issues[0]?.message || "Validation failed",
            }
        }
        console.error("Onboarding error:", error)
        return {
            success: false,
            data: null,
            error: "Failed to complete profile. Please try again.",
        }
    }
}

export async function getUserRoleAction(userEmail: string) {
    try {
        // Query user by email via Convex
        const user = await convex.query(api.user.getByEmail, {
            email: userEmail,
        })

        return { success: true, role: user?.role || null }
    } catch (error) {
        console.error("Error fetching user role:", error)
        return { success: false, role: null }
    }
}

