"use client";

import { ConfirmModal } from "@/components/modal/confirm-modal";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

interface ActionsProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
}

export const Actions = ({
    disabled,
    courseId,
    isPublished
}: ActionsProps) => {

    const router = useRouter();
    const confetti = useConfettiStore();
    const [isLoading, setIsLoading] = useState(false);
    const publishCourse = useMutation(api.courses.publish);
    const deleteCourse = useMutation(api.courses.deleteCourse);

    const onClick = async () => {
        try {
            setIsLoading(true);

            if (isPublished) {
                await publishCourse({ courseId: courseId as any, isPublished: false });
                toast.success("Course unpublished");
            } else {
                await publishCourse({ courseId: courseId as any, isPublished: true });
                toast.success("Course published");
                confetti.onOpen();
            }
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }

    }
    const onDelete = async () => {
        try {
            setIsLoading(true);
            await deleteCourse({ courseId: courseId as any });
            toast.success("Course deleted");
            router.refresh();
            router.push(`/dashboard/instructor/courses`);

        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                variant="outline"
                size="sm"
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    )
}