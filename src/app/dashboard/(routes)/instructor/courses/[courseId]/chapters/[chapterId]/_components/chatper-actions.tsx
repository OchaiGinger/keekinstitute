"use client";

import { ConfirmModal } from "@/components/modal/confirm-modal";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

interface ChapterActionsProps {
    disabled: boolean;
    courseId: string;
    chapterId: string;
    isPublished: boolean;
}

export const ChapterActions = ({
    disabled,
    courseId,
    chapterId,
    isPublished,
}: ChapterActionsProps) => {
    const updateChapter = useMutation(api.chapters.update);
    const deleteChapter = useMutation(api.chapters.deleteChapter);

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {

        try {
            setIsLoading(true);

            await updateChapter({
                chapterId: chapterId as any,
                isPublished: !isPublished,
            });

            toast.success(isPublished ? "Chapter unpublished" : "Chapter published");
            router.refresh();
            return;

        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }

    }
    const onDelete = async () => {
        try {
            setIsLoading(true);
            await deleteChapter({
                chapterId: chapterId as any,
            });
            toast.success("Chapter deleted");
            router.refresh();
            router.push(`/dashboard/instructor/courses/${courseId}`);

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
                disabled={isLoading}
                variant="outline"
                size="sm"
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button disabled={isLoading}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    )
}