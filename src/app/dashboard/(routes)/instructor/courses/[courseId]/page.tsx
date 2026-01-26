"use client";

import { CircleDollarSign, File, LayoutDashboard, ListChecks, Users } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { use } from "react";

import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";
import { ChaptersForm } from "./_components/chapters-form";
import { Actions } from "./_components/actions";
import { CourseTypeForm } from "./_components/course-type-form";
import { TargetStudentTypeForm } from "./_components/target-student-type-form";

const CourseIdPage = ({
  params
}: {
  params: Promise<{ courseId: string }>
}) => {
  const { courseId } = use(params);

  const course = useQuery(api.courses.getById, courseId ? {
    courseId: courseId as any,
  } : "skip");

  const categories = useQuery(api.categories.getAll);
  const chapters = useQuery(api.chapters.getByCourse, courseId ? {
    courseId: courseId as any,
  } : "skip");

  // Show loading state while data is being fetched
  if (course === undefined || categories === undefined || chapters === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  // Redirect if course not found
  if (!course || !courseId) {
    throw new Error("Course not found");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    (chapters && chapters.length > 0) || false,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields} / ${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner
          label="This course is unpublished. It will not be visible to the students."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">
              Course setup
            </h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={course._id}
            isPublished={course.isPublished || false}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">
                Customize your course
              </h2>
            </div>
            <TitleForm
              initialData={course}
              courseId={course._id}
            />
            <DescriptionForm
              initialData={course}
              courseId={course._id}
            />
            <ImageForm
              initialData={course}
              courseId={course._id}
            />
            <CategoryForm
              initialData={course}
              courseId={course._id}
              options={(categories || []).map((category: any) => ({
                label: category.name,
                value: category._id || category.id,
              }))}
            />
            <CourseTypeForm
              initialData={course}
              courseId={course._id}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Users} />
                <h2 className="text-xl">
                  Target Students
                </h2>
              </div>
              <TargetStudentTypeForm
                initialData={course}
                courseId={course._id}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">
                  Course chapters
                </h2>
              </div>
              <ChaptersForm
                initialData={{ ...course, chapters }}
                courseId={course._id}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">
                  Sell your course
                </h2>
              </div>
              <PriceForm
                initialData={course}
                courseId={course._id}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">
                  Resources & Attachments
                </h2>
              </div>
              <AttachmentForm
                initialData={course}
                courseId={course._id}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseIdPage;