"use server"

import { z } from "zod"
import { ConvexHttpClient } from "convex/browser"
import { api } from "../../../../../../convex/_generated/api"
import { auth } from "@clerk/nextjs/server"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

// Zod schema for instructor onboarding
const instructorOnboardingSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    specialization: z.string().min(2, "Specialization is required"),
    bio: z.string().min(10, "Bio must be at least 10 characters"),
    experience: z.string().min(1, "Years of experience is required"),
    qualifications: z.string().min(10, "Qualifications must be at least 10 characters"),
})

type InstructorOnboardingData = z.infer<typeof instructorOnboardingSchema>

export async function completeInstructorOnboardingAction(data: InstructorOnboardingData) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return { success: false, error: "Not authenticated" }
        }

        // Validate with Zod
        const validated = instructorOnboardingSchema.parse(data)

        // Get user by auth ID
        const userByAuthId = await convex.query(api.user.getByAuthId, {
            authUserId: userId,
        })

        if (!userByAuthId) {
            return { success: false, error: "User not found" }
        }

        // Update user with onboarding data
        await convex.mutation(api.user.updateInstructorOnboarding, {
            userId: userByAuthId._id,
            fullName: validated.fullName,
            specialization: validated.specialization,
            bio: validated.bio,
            experience: validated.experience,
            qualifications: validated.qualifications,
            onboardingCompleted: true,
            onboardingCompletedAt: Date.now(),
        })

        return { success: true, error: "" }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.issues[0]?.message || "Validation failed",
            }
        }
        console.error("Instructor onboarding error:", error)
        return {
            success: false,
            error: "Failed to complete onboarding. Please try again.",
        }
    }
}
