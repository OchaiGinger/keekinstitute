import { Sidebar } from "./_components/Sidebar";
import { Navbar } from "./_components/navbar";
import { redirect } from "next/navigation";
import getSafeProfile from "@/actions/get-safe-profile";
import { validateUserExists } from "@/actions/validate-user-exists";

// Never cache dashboard - always get fresh auth state
export const revalidate = 0;
export const dynamic = "force-dynamic";

const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  console.log("[DashboardLayout] Starting...");

  // Ensure user still exists (may be deleted by admin)
  const userExists = await validateUserExists();
  if (!userExists) {
    console.log("[DashboardLayout] User deleted, redirecting to /");
    redirect("/");
  }

  const safeProfile = await getSafeProfile();

  if (!safeProfile) {
    console.log("[DashboardLayout] No profile found, redirecting to /");
    redirect("/");
  }

  console.log(
    "[DashboardLayout] Profile:",
    `${safeProfile.role} - onboarding: ${safeProfile.onboardingCompleted}`
  );

  /**
   * STUDENT-ONLY GUARDS
   */
  if (safeProfile.role === "student") {
    // ID verification check (type-safe)
    if (!("verificationIdUsed" in safeProfile) || !safeProfile.verificationIdUsed) {
      console.log("[DashboardLayout] Student not verified, redirecting to /verify-id");
      redirect("/verify-id");
    }

    // Onboarding check
    if (!safeProfile.onboardingCompleted) {
      console.log("[DashboardLayout] Student onboarding incomplete, redirecting");
      redirect("/student-onboarding");
    }
  }

  console.log("[DashboardLayout] Rendering dashboard for role:", safeProfile.role);

  return (
    <div className="h-full dark:bg-gray-900">
      {/* Top Navbar */}
      <div className="h-20 md:pl-56 fixed inset-y-0 w-full z-50 dark:bg-gray-900">
        <Navbar currentProfile={safeProfile} />
      </div>

      {/* Sidebar */}
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50 dark:bg-gray-900">
        <Sidebar
          userRole={safeProfile.role as "admin" | "instructor" | "student"}
        />
      </div>

      {/* Main Content */}
      <main className="md:pl-56 pt-20 h-full dark:bg-gray-900">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
