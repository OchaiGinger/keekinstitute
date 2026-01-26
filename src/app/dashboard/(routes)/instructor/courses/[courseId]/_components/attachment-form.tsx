"use client";
import * as z from "zod";
import { Pencil, PlusCircle, ImageIcon, File, Loader2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { cn } from "@/lib/utils";

interface AttachmentFormProps {
  initialData: {
    attachments?: any[];
    _id: string;
  };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
  originalFilename: z.string().min(1),
});

export const AttachmentForm = ({
  initialData,
  courseId,
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const createAttachment = useMutation(api.attachments.create);
  const deleteAttachment = useMutation(api.attachments.delete_);

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Save attachment to database
      await createAttachment({
        courseId: initialData._id as any,
        url: values.url,
        originalFilename: values.originalFilename,
      });
      toast.success("Attachment added successfully");
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.error("Error saving attachment:", error);
      toast.error("Failed to add attachment");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteAttachment({
        attachmentId: id as any,
      });
      toast.success("Attachment deleted");
      router.refresh();
    } catch (error) {
      console.error("Error deleting attachment:", error);
      toast.error("Failed to delete attachment");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-gray-800 dark:text-slate-300">
      <div className="font-medium flex items-center justify-between">
        Course attachments
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && (
            <>Cancel</>
          )}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments && initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachments yet
            </p>
          )}
          {initialData.attachments && initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment._id || attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"
                >
                  <File className="h-4 w-4 mr-2 shrink-0" />
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs line-clamp-1 hover:underline"
                  >
                    {attachment.originalFilename || attachment.name}
                  </a>
                  {deletingId === (attachment._id || attachment.id) && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== (attachment._id || attachment.id) && (
                    <button
                      title="Delete attachment"
                      onClick={() => onDelete(attachment._id || attachment.id)}
                      className="ml-auto hover:opacity-75 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url, originalFilename) => {
              if (url && originalFilename) {
                onSubmit({ url: url, originalFilename: originalFilename });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add anything your students might need to complete the course.
          </div>
        </div>
      )}
    </div>
  );
};