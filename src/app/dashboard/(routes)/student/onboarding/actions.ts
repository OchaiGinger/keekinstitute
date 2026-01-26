"use server"

import { z } from "zod"
import { ConvexHttpClient } from "convex/browser"
import { api } from "../../../../../../convex/_generated/api"
import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

// Zod schema for student onboarding (removed fullName)
const studentOnboardingSchema = z.object({
    studentType: z.string().min(1, "Please select a student type"),
    learningGoals: z.string().min(10, "Learning goals must be at least 10 characters"),
})

type StudentOnboardingData = z.infer<typeof studentOnboardingSchema>

export async function completeStudentOnboardingAction(data: StudentOnboardingData) {
    try {
        console.log("[completeStudentOnboardingAction] Starting with data:", data)
        const { userId } = await auth()
        console.log("[completeStudentOnboardingAction] userId:", userId)
        
        if (!userId) {
            console.error("[completeStudentOnboardingAction] Not authenticated")
            return { success: false, error: "Not authenticated" }
        }

        // Validate with Zod
        const validated = studentOnboardingSchema.parse(data)
        console.log("[completeStudentOnboardingAction] Validated data:", validated)

        // Get user by auth ID
        console.log("[completeStudentOnboardingAction] Querying user by authId:", userId)
        const userByAuthId = await convex.query(api.user.getByAuthId, {
            authUserId: userId,
        })
        console.log("[completeStudentOnboardingAction] User found:", userByAuthId?._id)

        if (!userByAuthId) {
            console.error("[completeStudentOnboardingAction] User not found in Convex")
            return { success: false, error: "User not found" }
        }

        // Update user with onboarding data
        console.log("[completeStudentOnboardingAction] Updating user onboarding data...")
        await convex.mutation(api.user.updateStudentOnboarding, {
            userId: userByAuthId._id,
            studentType: validated.studentType,
            learningGoals: validated.learningGoals,
            onboardingCompleted: true,
            onboardingCompletedAt: Date.now(),
        })
        console.log("[completeStudentOnboardingAction] User updated successfully")

        return { success: true, error: "" }
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("[completeStudentOnboardingAction] Validation error:", error.issues)
            return {
                success: false,
                error: error.issues[0]?.message || "Validation failed",
            }
        }
        console.error("[completeStudentOnboardingAction] Unexpected error:", error)
        return {
            success: false,
            error: "Failed to complete onboarding. Please try again.",
        }
    }
}
