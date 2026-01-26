import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function CoursesPage() {
  const { userId } = await auth();

  // If not logged in, redirect to signup
  if (!userId) {
    return redirect("/signup");
  }

  // If logged in, redirect to student courses dashboard
  return redirect("/dashboard/student/courses");
}
