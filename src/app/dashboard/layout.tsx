import { SidebarIcon } from "lucide-react";
import { Sidebar } from "./_components/Sidebar";
import { Navbar } from "./_components/navbar";
import { redirect } from "next/navigation";
import getSafeProfile from "@/actions/get-safe-profile";

// Never cache dashboard - always get fresh auth state
export const revalidate = 0;
export const dynamic = "force-dynamic";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const safeProfile = await getSafeProfile();

  if (!safeProfile) {
    return redirect("/");
  }

  // Redirect students to onboarding if they haven't completed it
  // This must be checked at the layout level before rendering dashboard
  if (safeProfile.role === "student" && !safeProfile.onboardingCompleted) {
    return redirect("/dashboard/student/onboarding");
  }
  
  return (
    <div className="h-full dark:bg-gray-900">
      <div className="h-20 md:pl-56 fixed inset-y-0 w-full z-50 dark:bg-gray-900">
        <Navbar currentProfile={safeProfile} />
      </div>

      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50 dark:bg-gray-900">
        <Sidebar userRole={safeProfile.role as "admin" | "instructor" | "student"} />
      </div>

      <main className="md:pl-56 pt-20 h-full dark:bg-gray-900">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;