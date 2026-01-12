"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useConvexAuth } from "convex/react"
import { useUser } from "@clerk/nextjs"
import { api } from "../../../../convex/_generated/api"
import { z } from "zod"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import AssessmentForm from "../../assessment/_components/assessment_form"

// ---------------- Zod schema ----------------
const onboardingSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
})

interface Props {
    initialName: string
}

type OnboardingStep = "profile" | "assessment"

export default function OnboardingForm({ initialName }: Props) {
    const router = useRouter()
    const { isAuthenticated, isLoading } = useConvexAuth() // Convex auth hook
    const { user } = useUser() // Get Clerk user
    const completeOnboarding = useMutation(api.user.completeOnboarding)

    const [step, setStep] = useState<OnboardingStep>("profile")
    const [name, setName] = useState(initialName)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!isAuthenticated) {
            setError("Authentication not ready. Please wait.")
            return
        }

        if (!user) {
            setError("User not found. Please sign in again.")
            return
        }

        // Validate form with Zod
        const parsed = onboardingSchema.safeParse({ name })
        if (!parsed.success) {
            setError(parsed.error.issues[0].message)
            return
        }

        try {
            setLoading(true)
            // Pass authUserId (Clerk user.id) to the mutation
            await completeOnboarding({
                authUserId: user.id,
                name: parsed.data.name
            })
            // Move to assessment step
            setStep("assessment")
        } catch (e) {
            console.error(e)
            setError("Failed to complete profile.")
        } finally {
            setLoading(false)
        }
    }

    if (isLoading) return null // wait for Convex auth

    return (
        <div>
            {step === "profile" && (
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Complete your profile</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="name">Full name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    disabled={loading}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Continuing..." : "Continue"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {step === "assessment" && (
                <div className="w-full max-w-4xl">
                    <AssessmentForm onComplete={() => router.replace("/dashboard")} />
                </div>
            )}
        </div>
    )
}
