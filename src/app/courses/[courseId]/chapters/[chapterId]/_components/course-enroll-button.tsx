"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
  userId: string;
}

export const CourseEnrollButton = ({
  price,
  courseId,
  userId,
}: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const enrollCourse = useMutation(api.enrollments.create);

  const onClick = async () => {
    try {
      setIsLoading(true);

      await enrollCourse({
        userId: userId as any,
        courseId: courseId as any,
      });

      toast.success("Enrolled successfully!");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      size="sm"
      className="w-full md:w-auto"
    >
      Enroll for {formatPrice(price)}
    </Button>
  )
}