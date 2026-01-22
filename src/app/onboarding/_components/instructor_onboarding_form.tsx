"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "convex/react"
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
import { Textarea } from "@/components/ui/textarea"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    Form,
} from "@/components/ui/form"

// Zod schema for instructor profile
const instructorProfileSchema = z.object({
    bio: z.string().min(10, "Bio must be at least 10 characters").optional().or(z.literal("")),
    specialization: z.string().min(2, "Specialization is required"),
    qualifications: z.string().optional().or(z.literal("")),
    experience: z.string().min(1, "Years of experience is required"),
})

type InstructorFormData = z.infer<typeof instructorProfileSchema>

interface Props {
    userId: string
    userEmail: string
    userName: string
    onComplete: () => void
}

export default function InstructorOnboardingForm({
    userId,
    userEmail,
    userName,
    onComplete,
}: Props) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [globalError, setGlobalError] = useState<string | null>(null)

    // Setup react-hook-form with Zod resolver
    const form = useForm<InstructorFormData>({
        resolver: zodResolver(instructorProfileSchema),
        defaultValues: {
            bio: "",
            specialization: "",
            qualifications: "",
            experience: "",
        },
    })

    const isSubmitting = form.formState.isSubmitting || isPending

    // Fetch categories for specialization
    const categories = useQuery(api.categories.getAll)

    const onSubmit = async (data: InstructorFormData) => {
        setGlobalError(null)

        startTransition(async () => {
            try {
                // Instructor profile data validated with Zod
                console.log("Instructor profile submitted:", data)

                // Call onComplete to proceed to next step or dashboard
                onComplete()
            } catch (e) {
                console.error(e)
                setGlobalError("Failed to save instructor profile.")
            }
        })
    }

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Complete Your Instructor Profile</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                    Help students learn more about your expertise
                </p>
            </CardHeader>

            <CardContent>
                {globalError && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{globalError}</AlertDescription>
                    </Alert>
                )}

                <div className="bg-slate-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">{userName}</p>
                            <p className="text-sm text-muted-foreground">{userEmail}</p>
                        </div>
                        <Badge>Instructor</Badge>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Specialization */}
                        <FormField
                            control={form.control}
                            name="specialization"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Primary Specialization *</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={isSubmitting}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your specialization" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories?.map((cat) => (
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
                                    <FormLabel>Years of Experience *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            placeholder="e.g., 5"
                                            disabled={isSubmitting}
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
                                    <FormLabel>About You</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell students about yourself, your teaching style, and why they should take your courses..."
                                            disabled={isSubmitting}
                                            rows={4}
                                            {...field}
                                        />
                                    </FormControl>
                                    <p className="text-xs text-muted-foreground">
                                        Minimum 10 characters (optional)
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
                                    <FormLabel>Qualifications & Certifications</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="List your relevant degrees, certifications, and achievements..."
                                            disabled={isSubmitting}
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <p className="text-xs text-muted-foreground">(Optional)</p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Continue"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
