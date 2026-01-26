"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { completeInstructorOnboardingAction } from "../actions"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Badge } from "@/components/ui/badge"

// Zod schema matching server action
const instructorOnboardingSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    specialization: z.string().min(2, "Specialization is required"),
    bio: z.string().min(10, "Bio must be at least 10 characters"),
    experience: z.string().min(1, "Years of experience is required"),
    qualifications: z.string().min(10, "Qualifications must be at least 10 characters"),
})

type InstructorOnboardingData = z.infer<typeof instructorOnboardingSchema>

interface Category {
    _id: string
    name: string
}

interface Props {
    categories?: Category[]
}

export default function InstructorOnboardingForm({ categories = [] }: Props = {}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const form = useForm<InstructorOnboardingData>({
        resolver: zodResolver(instructorOnboardingSchema),
        defaultValues: {
            fullName: "",
            specialization: "",
            bio: "",
            experience: "",
            qualifications: "",
        },
    })

    const isSubmitting = form.formState.isSubmitting || isPending

    const onSubmit = (data: InstructorOnboardingData) => {
        startTransition(async () => {
            const result = await completeInstructorOnboardingAction(data)

            if (!result.success) {
                form.setError("root", {
                    message: result.error,
                })
                return
            }

            // Success - redirect to instructor dashboard
            router.replace("/dashboard/instructor")
        })
    }

    return (
        <div className="w-full max-w-2xl">
            <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-lg">
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-2xl">Welcome, Instructor! 👨‍🏫</CardTitle>
                            <CardDescription className="text-amber-100">
                                Build your instructor profile and showcase your expertise
                            </CardDescription>
                        </div>
                        <Badge className="bg-white text-amber-600 hover:bg-white/90">Educator</Badge>
                    </div>
                </CardHeader>

                <CardContent className="pt-6">
                    {form.formState.errors.root && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {form.formState.errors.root.message}
                            </AlertDescription>
                        </Alert>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Full Name */}
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-semibold">Full Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your full name"
                                                disabled={isSubmitting}
                                                className="h-10"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Specialization */}
                            <FormField
                                control={form.control}
                                name="specialization"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-semibold">Primary Specialization *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-10">
                                                    <SelectValue placeholder="Select your specialization" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat._id} value={cat.name}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Experience */}
                            <FormField
                                control={form.control}
                                name="experience"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-semibold">Years of Experience *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="70"
                                                placeholder="e.g., 5"
                                                disabled={isSubmitting}
                                                className="h-10"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Bio */}
                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-semibold">About You</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Tell students about yourself, your teaching style, achievements, and why they should take your courses..."
                                                disabled={isSubmitting}
                                                rows={4}
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <p className="text-xs text-muted-foreground">
                                            Minimum 10 characters
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Qualifications */}
                            <FormField
                                control={form.control}
                                name="qualifications"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-semibold">Qualifications & Certifications</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="List your relevant degrees, certifications, professional memberships, and key achievements..."
                                                disabled={isSubmitting}
                                                rows={3}
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <p className="text-xs text-muted-foreground">
                                            Minimum 10 characters
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full h-11 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 font-semibold text-base"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Setting up your profile..." : "Complete Setup"}
                            </Button>
                        </form>
                    </Form>

                    <p className="text-xs text-muted-foreground text-center mt-4">
                        Your profile helps students learn about your expertise and decide which courses to take. You can edit this information anytime.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
