"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useConvexAuth, useQuery, useMutation } from "convex/react"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import AssessmentForm from "../../assessment/_components/assessment_form"
import InstructorOnboardingForm from "./instructor_onboarding_form"
import { completeOnboardingAction } from "../actions"

// Zod schema
const onboardingSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
})

const studentTypeSchema = z.object({
    studentType: z.enum(["IT", "External", "KeekInstitute"]),
})

type OnboardingFormData = z.infer<typeof onboardingSchema>
type StudentTypeFormData = z.infer<typeof studentTypeSchema>
type OnboardingStep = "profile" | "studentType" | "instructor" | "assessment" | "complete"
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
    const updateUserStudentType = useMutation(api.user.updateStudentType)

    const [step, setStep] = useState<OnboardingStep>("profile")
    const [userRole, setUserRole] = useState<UserRole | null>(null)
    const [globalError, setGlobalError] = useState<string | null>(null)
    const [selectedStudentType, setSelectedStudentType] = useState<string | null>(null)

    const form = useForm<OnboardingFormData>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: { name: initialName },
    })

    const studentTypeForm = useForm<StudentTypeFormData>({
        resolver: zodResolver(studentTypeSchema),
        defaultValues: { studentType: "" as any },
    })

    const isSubmitting = form.formState.isSubmitting || isPending
    const isStudentTypeSubmitting = studentTypeForm.formState.isSubmitting || isPending

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
                    setStep("studentType")
                } else {
                    router.push("/dashboard/student")
                }
            } catch (e) {
                console.error(e)
                setGlobalError("Failed to complete profile.")
            }
        })
    }

    const onStudentTypeSubmit = async (data: StudentTypeFormData) => {
        setGlobalError(null)
        setSelectedStudentType(data.studentType)

        startTransition(async () => {
            try {
                // Update user with student type
                if (userByEmail && userByEmail._id) {
                    await updateUserStudentType({
                        userId: userByEmail._id,
                        studentType: data.studentType,
                    })
                }

                setStep("assessment")
            } catch (e) {
                console.error(e)
                setGlobalError("Failed to save student type.")
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

            {step === "studentType" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Select Your Student Type</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {globalError && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{globalError}</AlertDescription>
                            </Alert>
                        )}

                        <Form {...studentTypeForm}>
                            <form onSubmit={studentTypeForm.handleSubmit(onStudentTypeSubmit)} className="space-y-4">
                                <FormField
                                    control={studentTypeForm.control}
                                    name="studentType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Which type of student are you?</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select your student type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="IT">IT Student</SelectItem>
                                                    <SelectItem value="External">External Student (Polytechnic)</SelectItem>
                                                    <SelectItem value="KeekInstitute">Kee Institute Student</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full" disabled={isStudentTypeSubmitting}>
                                    {isStudentTypeSubmitting ? "Saving..." : "Continue"}
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
                            router.replace("/dashboard/instructor")
                        }}
                    />
                </div>
            )}

            {step === "assessment" && (
                <div className="w-full max-w-4xl">
                    <AssessmentForm onComplete={() => {
                        if (userRole === "instructor") {
                            router.replace("/dashboard/instructor")
                        } else {
                            router.replace("/dashboard/student")
                        }
                    }} />
                </div>
            )}
        </div>
    )
}
