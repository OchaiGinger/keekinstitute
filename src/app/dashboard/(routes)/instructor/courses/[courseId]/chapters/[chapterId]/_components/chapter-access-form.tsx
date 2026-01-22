"use client";

import { Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChapterAccessFormProps {
  initialData: {
    isPublished?: boolean;
    isFree?: boolean;
  };
  courseId: string;
  chapterId: string;
};

export const ChapterAccessForm = ({
  initialData,
  courseId,
  chapterId
}: ChapterAccessFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

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
              View status
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
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
      )}
      {!isEditing && (
        <p className="text-xs text-muted-foreground mt-2">
          {initialData.isFree ? "This chapter is free for all students" : "This chapter requires payment"}
        </p>
      )}
      {isEditing && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            Chapter access features are being migrated. Please run <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-xs">npx convex dev</code> to complete the setup.
          </p>
        </div>
      )}
    </div>
  );
}