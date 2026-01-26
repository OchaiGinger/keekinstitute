"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface CourseTypeFormProps {
    initialData: {
        courseType?: string;
        _id: string;
    };
    courseId: string;
}

const studentTypeOptions = [
    { label: "IT Students", value: "IT" },
    { label: "External Students (Polytechnic)", value: "External" },
    { label: "Kee Institute Students", value: "KeekInstitute" },
];

const formSchema = z.object({
    courseType: z.string().min(1, "Student type is required"),
});

export const CourseTypeForm = ({
    initialData,
    courseId,
}: CourseTypeFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    const updateCourse = useMutation(api.courses.update);

    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            courseType: initialData?.courseType || ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await updateCourse({
                courseId: initialData._id as any,
                courseType: values.courseType,
            });
            toast.success("Course type updated");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Failed to update course type");
        }
    }

    const getSelectedLabel = () => {
        const selected = studentTypeOptions.find(opt => opt.value === initialData.courseType);
        return selected ? selected.label : "No course type selected";
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-gray-800">
            <div className="font-medium flex items-center justify-between">
                Course Type (Student Audience)
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                    "text-sm mt-2",
                    !initialData.courseType && "text-slate-500 italic"
                )}>
                    {getSelectedLabel()}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="courseType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Select Student Type</FormLabel>
                                    <Select
                                        disabled={isSubmitting}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a student type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {studentTypeOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}
