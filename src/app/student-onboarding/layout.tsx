import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function StudentOnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Simple auth check - just ensure user is logged in
  const { userId } = await auth();

  if (!userId) {
    redirect("/signup");
  }

  // Don't use the dashboard layout - just render the form directly
  return <>{children}</>;
}
