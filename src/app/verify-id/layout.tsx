import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { validateUserExists } from "@/actions/validate-user-exists";

export default async function VerifyIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/signup");
  }

  // Validate that the user still exists (they might have been deleted by admin)
  const userExists = await validateUserExists();
  if (!userExists) {
    console.log("[VerifyIdLayout] User deleted, redirecting to /");
    redirect("/");
  }

  return <>{children}</>;
}
