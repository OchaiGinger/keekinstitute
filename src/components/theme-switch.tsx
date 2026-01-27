"use client";
import { useTheme } from "./providers/theme-provider"
import React, { useCallback } from "react";
import { BsMoon, BsSun } from "react-icons/bs";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

import { FaArrowUp, FaHome } from "react-icons/fa";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [localUserId, setLocalUserId] = React.useState<string | null>(null);

  // Get user record from Convex to check role
  const userRecord = useQuery(
    api.user.getByAuthId,
    localUserId ? { authUserId: localUserId } : "skip"
  );

  React.useEffect(() => {
    if (!isLoaded || !user) return;
    setLocalUserId(user.id);
  }, [isLoaded, user]);

  const scrollToTop = useCallback((): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleDashboardClick = useCallback((): void => {
    if (!userRecord || !isLoaded) return;
    
    // Determine role and redirect accordingly
    const role = userRecord?.role || "student";
    router.push(`/dashboard/${role}`);
  }, [userRecord, isLoaded, router]);

  return (
    <>
      <div className="fixed bottom-5 right-5 flex gap-4">
        <button
          title="Toggle theme"
          className="bg-white w-[3rem] h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] border border-white border-opacity-40 shadow-2xl rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all dark:bg-gray-950"
          onClick={toggleTheme}
        >
          {theme === "light" ? <BsSun /> : <BsMoon />}
        </button>

        <button
          title="Scroll to top"
          className="bg-white w-[3rem] h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] border border-white border-opacity-40 shadow-2xl rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all dark:bg-gray-950"
          onClick={scrollToTop}
        >
          <FaArrowUp />
        </button>

        <SignedIn>
          <button
            title="Go to Dashboard"
            onClick={handleDashboardClick}
            className="bg-white w-[3rem] h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] border border-white border-opacity-40 shadow-2xl rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all dark:bg-gray-950"
          >
            <FaHome />
          </button>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-[48px] w-[48px] rounded-[24px]",
              },
            }}
          />
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal" forceRedirectUrl="/dashboard">
            <button
              title="Sign in"
              className="bg-white w-[3rem] h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] border border-white border-opacity-40 shadow-2xl rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all dark:bg-gray-950"
            >
              {/* Icon placeholder - SignInButton handles the rendering */}
              Sign In
            </button>
          </SignInButton>
        </SignedOut>

      </div>

      
    </>
  );
}