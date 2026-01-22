"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useConvexAuth, useQuery } from "convex/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    Form,
} from "@/components/ui/form"
import AssessmentForm from "../../assessment/_components/assessment_form"
import InstructorOnboardingForm from "./instructor_onboarding_form"
import { completeOnboardingAction } from "../actions"

// Zod schema
const onboardingSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
})

type OnboardingFormData = z.infer<typeof onboardingSchema>
type OnboardingStep = "profile" | "instructor" | "assessment" | "complete"
type UserRole = "student" | "instructor" | "admin"

interface Props {
    initialName: string
    userEmail: string
    clerkUserId: string
}

export default function OnboardingForm({ initialName, userEmail, clerkUserId }: Props) {
    const router = useRouter()
    const { isLoading: convexLoading } = useConvexAuth()
    const [isPending, startTransition] = useTransition()

    const [step, setStep] = useState<OnboardingStep>("profile")
    const [userRole, setUserRole] = useState<UserRole | null>(null)
    const [globalError, setGlobalError] = useState<string | null>(null)

    const form = useForm<OnboardingFormData>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: { name: initialName },
    })

    const isSubmitting = form.formState.isSubmitting || isPending

    // Query user by email to get their pre-assigned role
    const userByEmail = useQuery(
        api.user.getByEmail,
        userEmail ? { email: userEmail } : "skip"
    )

    useEffect(() => {
        if (userByEmail) {
            const role = userByEmail.role as "student" | "instructor" | "admin" | undefined
            if (role === "student" || role === "instructor" || role === "admin") {
                setUserRole(role)
            }
        }
    }, [userByEmail])

    const onSubmit = async (data: OnboardingFormData) => {
        setGlobalError(null)

        startTransition(async () => {
            try {
                const result = await completeOnboardingAction(data, clerkUserId, userEmail)

                if (!result.success) {
                    setGlobalError(result.error as string)
                    return
                }

                // Route based on user role
                if (userRole === "instructor") {
                    setStep("instructor")
                } else if (userRole === "student") {
                    setStep("assessment")
                } else {
                    router.push("/student")
                }
            } catch (e) {
                console.error(e)
                setGlobalError("Failed to complete profile.")
            }
        })
    }

    if (convexLoading) return null

    if (!userRole) {
        return (
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle>Loading...</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Please wait while we set up your account.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="w-full max-w-2xl">
            {step === "profile" && (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {userRole === "instructor" ? "Complete Your Instructor Profile" : "Complete Your Profile"}
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {globalError && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{globalError}</AlertDescription>
                            </Alert>
                        )}

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="John Doe"
                                                    disabled={isSubmitting}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? "Continuing..." : "Continue"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            )}

            {step === "instructor" && (
                <div>
                    <InstructorOnboardingForm
                        userId={clerkUserId}
                        userEmail={userEmail}
                        userName={form.getValues("name")}
                        onComplete={() => {
                            router.replace("/instructor")
                        }}
                    />
                </div>
            )}

            {step === "assessment" && (
                <div className="w-full max-w-4xl">
                    <AssessmentForm onComplete={() => {
                        if (userRole === "instructor") {
                            router.replace("/instructor")
                        } else {
                            router.replace("/student")
                        }
                    }} />
                </div>
            )}
        </div>
    )
}
