"use client";

import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface TargetStudentTypeFormProps {
    initialData: {
        targetStudentType?: string[];
        _id: string;
    };
    courseId: string;
}

type StudentType = "IT" | "External" | "KeekInstitute";

const studentTypeOptions = [
    { label: "IT Students", value: "IT" as StudentType },
    { label: "External Students (Polytechnic)", value: "External" as StudentType },
    { label: "Kee Institute Students", value: "KeekInstitute" as StudentType },
];

export const TargetStudentTypeForm = ({
    initialData,
    courseId,
}: TargetStudentTypeFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selected, setSelected] = useState<StudentType[]>(
        (initialData?.targetStudentType as StudentType[]) || []
    );

    const router = useRouter();
    const updateCourse = useMutation(api.courses.update);

    const toggleEdit = () => {
        setIsEditing((current) => !current);
        setSelected((initialData?.targetStudentType as StudentType[]) || []);
    };

    const onSubmit = async () => {
        if (selected.length === 0) {
            toast.error("Please select at least one student type");
            return;
        }

        try {
            setIsSubmitting(true);
            await updateCourse({
                courseId: initialData._id as any,
                targetStudentType: selected,
            });
            toast.success("Target student types updated");
            setIsEditing(false);
            router.refresh();
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to update target student types");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCheckChange = (value: StudentType, checked: boolean) => {
        if (checked) {
            setSelected([...selected, value]);
        } else {
            setSelected(selected.filter((v) => v !== value));
        }
    };

    const getSelectedLabels = () => {
        if (!initialData.targetStudentType || initialData.targetStudentType.length === 0) {
            return "No student types selected";
        }
        return initialData.targetStudentType
            .map(type => studentTypeOptions.find(opt => opt.value === type)?.label)
            .filter(Boolean)
            .join(", ");
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-gray-800">
            <div className="font-medium flex items-center justify-between">
                Target Student Types
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
                    (!initialData.targetStudentType || initialData.targetStudentType.length === 0) && "text-slate-500 italic"
                )}>
                    {getSelectedLabels()}
                </p>
            )}
            {isEditing && (
                <div className="space-y-4 mt-4">
                    <div className="space-y-3">
                        {studentTypeOptions.map((option) => (
                            <div key={option.value} className="flex flex-row items-center space-x-3">
                                <Checkbox
                                    checked={selected.includes(option.value)}
                                    onCheckedChange={(checked) =>
                                        handleCheckChange(option.value, checked as boolean)
                                    }
                                    disabled={isSubmitting}
                                />
                                <label className="cursor-pointer font-normal">
                                    {option.label}
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-x-2 pt-4">
                        <Button
                            disabled={isSubmitting || selected.length === 0}
                            onClick={onSubmit}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
