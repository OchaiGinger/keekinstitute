import { SidebarIcon } from "lucide-react";
import { Sidebar } from "./_components/Sidebar";
import { Navbar } from "./_components/navbar";
import { redirect } from "next/navigation";
import getSafeProfile from "@/actions/get-safe-profile";

// Never cache dashboard - always get fresh auth state
export const revalidate = 0;
export const dynamic = "force-dynamic";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  console.log("[DashboardLayout] Starting...");
  const safeProfile = await getSafeProfile();
  
  console.log("[DashboardLayout] Profile:", safeProfile ? `${safeProfile.role} - onboarding: ${safeProfile.onboardingCompleted}` : "null");

  if (!safeProfile) {
    console.log("[DashboardLayout] No profile, redirecting to /");
    return redirect("/");
  }

  // Redirect students to onboarding if they haven't completed it
  // BUT don't redirect if they're already on the onboarding page
  if (safeProfile.role === "student" && !safeProfile.onboardingCompleted) {
    // Check if current path is not already the onboarding page
    // For now, just allow the redirect - the onboarding layout will prevent the loop
    console.log("[DashboardLayout] Student without onboarding, redirecting to onboarding");
    return redirect("/student-onboarding");
  }
  
  console.log("[DashboardLayout] Rendering dashboard for role:", safeProfile.role);
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