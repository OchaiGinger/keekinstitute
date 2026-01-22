"use client";

import React, { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { ChapterTitleForm } from "./_components/chatper-title-form";
import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterAccessForm } from "./_components/chapter-access-form";
import { ChapterVideoForm } from "./_components/chapter-video-form";
import { Banner } from "@/components/banner";
import { ChapterActions } from "./_components/chatper-actions";

interface ChapterIdPageProps {
  params: Promise<{
    courseId: string;
    chapterId: string;
  }>;
}

const ChapterIdPage: React.FC<ChapterIdPageProps> = ({ params }) => {
  const { courseId, chapterId } = use(params);

  // Skip query if chapterId is not valid
  const chapter = useQuery(
    api.chapters.getById,
    (chapterId && chapterId !== "undefined") ? { chapterId: chapterId as any } : "skip"
  );

  if (!chapter) {
    return <div>Loading...</div>;
  }

  const requiredFields = [
    chapter.title,
    chapter.description,
    chapter.videoUrl,
  ]

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (<>
    {!chapter.isPublished && (
      <Banner
        variant="warning"
        label="This chapter is unpublished. It will not be visible in the course"
      />
    )}
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/dashboard/instructor/courses/${courseId}`}
            className="flex items-center text-sm hover:opacity-75 transition mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to course setup
          </Link>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Chapter Creation</h1>
            </div>
          </div>
          <span className="text-sm text-slate-700 dark:text-slate-300 ">
            Complete all fields {completionText}
          </span>
        </div>
        <ChapterActions
          disabled={!isComplete}
          courseId={courseId}
          chapterId={chapterId}
          isPublished={chapter.isPublished ?? false}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
          <div>
            <div className="flex items-ceenter gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl font-medium">Customize your chapter</h2>
            </div>
            <ChapterTitleForm
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
            <ChapterDescriptionForm
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
          </div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Eye} />
            <h2 className="text-xl font-medium">Access Settings</h2>
          </div>
          <ChapterAccessForm
            initialData={chapter}
            courseId={courseId}
            chapterId={chapterId}
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Video} />
            <h2 className="text-xl font-medium">Add a video</h2>
          </div>
          <ChapterVideoForm
            initialData={chapter}
            courseId={courseId}
            chapterId={chapterId}
          />
        </div>
      </div>
    </div>
  </>);
}

export default ChapterIdPage;