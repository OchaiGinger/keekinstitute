"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";
import { completeStudentOnboardingAction } from "../actions";
import { Sparkles, Target } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Zod schema - only studentType and learningGoals
const studentOnboardingSchema = z.object({
  studentType: z.string().min(1, "Please select a student type"),
  learningGoals: z.string().min(10, "Learning goals must be at least 10 characters"),
});

type StudentOnboardingData = z.infer<typeof studentOnboardingSchema>;

export default function StudentOnboardingForm() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isPending, startTransition] = useTransition();
  
  // Default student types with descriptions
  const studentTypes = [
    { name: "IT Student", desc: "Studying IT or Computer Science" },
    { name: "External Student (Polytechnic)", desc: "From a polytechnic institution" },
    { name: "KeekInstitute Student", desc: "Currently studying at KeekInstitute" }
  ];

  const form = useForm<StudentOnboardingData>({
    resolver: zodResolver(studentOnboardingSchema),
    defaultValues: {
      studentType: "",
      learningGoals: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting || isPending;

  const onSubmit = (data: StudentOnboardingData) => {
    console.log("[Form] Submitting student onboarding data:", data);
    startTransition(async () => {
      try {
        const result = await completeStudentOnboardingAction(data);

        if (!result.success) {
          form.setError("root", { message: result.error });
          return;
        }

        console.log("[Form] Onboarding complete, redirecting to assessment...");
        router.replace("/dashboard/student/assessment");
      } catch (error) {
        console.error("[Form] Unexpected error:", error);
        form.setError("root", {
          message: "An unexpected error occurred",
        });
      }
    });
  };

  return (
    <div className="w-full">
      {/* Top Section with Welcome */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {isLoaded && user?.firstName ? `Hello, ${user.firstName}!` : "Welcome!"}
          </h1>
          <Sparkles className="w-6 h-6 text-purple-600" />
        </div>
        <p className="text-gray-600 text-lg">Let's personalize your learning journey</p>
      </div>

      {/* Main Form Card */}
      <Card className="w-full shadow-2xl border-0 overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-br from-slate-900 via-blue-800 to-purple-900 text-white px-8 py-10 relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-400 rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <CardTitle className="text-2xl font-bold mb-2">Get Started</CardTitle>
            <CardDescription className="text-blue-100 text-base">
              Just 2 quick questions to customize your experience
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 py-10">
          {form.formState.errors.root && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {form.formState.errors.root.message}
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Student Type */}
              <FormField
                control={form.control}
                name="studentType"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">1</span>
                      </div>
                      <FormLabel className="text-base font-semibold text-gray-800 cursor-pointer">
                        What's your student type?
                      </FormLabel>
                    </div>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 text-base border-2 border-gray-200 hover:border-blue-400 focus:border-blue-600 transition">
                          <SelectValue placeholder="Choose your student type..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-2">
                        {studentTypes.map((type) => (
                          <SelectItem key={type.name} value={type.name} className="cursor-pointer">
                            <div className="flex flex-col">
                              <span className="font-medium">{type.name}</span>
                              <span className="text-xs text-gray-500">{type.desc}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Learning Goals */}
              <FormField
                control={form.control}
                name="learningGoals"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-sm">2</span>
                      </div>
                      <FormLabel className="text-base font-semibold text-gray-800 cursor-pointer">
                        What are your learning goals?
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="E.g., Master full-stack development, get a tech job, learn AI fundamentals..."
                        disabled={isSubmitting}
                        rows={4}
                        className="resize-none text-base border-2 border-gray-200 hover:border-purple-400 focus:border-purple-600 transition"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500">
                        Min. 10 characters
                      </p>
                      <p className="text-xs text-gray-400">
                        {field.value?.length || 0} characters
                      </p>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-semibold text-base shadow-lg hover:shadow-xl transition-all"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Setting up...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Get Started
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </Form>

          {/* Footer Message */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
            <p className="text-xs text-gray-600 text-center">
              ✨ Your preferences help us recommend the perfect courses and track your progress
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
