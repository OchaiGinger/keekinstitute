"use client";

import { Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  isPublished: z.boolean().optional(),
  isFree: z.boolean().optional(),
});

interface ChapterAccessFormProps {
  initialData: {
    isPublished?: boolean;
    isFree?: boolean;
  };
  courseId: string;
  chapterId: string;
}

export const ChapterAccessForm = ({
  initialData,
  courseId,
  chapterId
}: ChapterAccessFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const updateChapter = useMutation(api.chapters.update);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isPublished: initialData.isPublished || false,
      isFree: initialData.isFree || false,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateChapter({
        chapterId: chapterId as any,
        isPublished: values.isPublished,
        isFree: values.isFree,
      });
      toast.success("Chapter access updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Failed to update chapter access");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-gray-800">
      <div className="font-medium flex items-center justify-between">
        Chapter Access
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Access
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          <p className={cn(
            "text-sm mt-2",
            !initialData.isPublished && "text-slate-700 italic dark:text-slate-300"
          )}>
            {initialData.isPublished ? (
              <>This chapter is published</>
            ) : (
              <>This chapter is not published yet.</>
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {initialData.isFree ? "This chapter is free for all students" : "This chapter requires payment"}
          </p>
        </>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer">
                    Publish this chapter
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer">
                    Make this chapter free for all students
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2 pt-4">
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
  );
}
