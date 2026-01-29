"use server";

import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { api } from "@/../convex/_generated/api";
import { getConvexClient } from "@/lib/convex-client";

export default async function getSafeProfile() {
  try {
    const authResult = await auth();
    const { userId } = authResult as any;

    if (!userId) {
      return null;
    }

    let clerkUser = null;
    try {
      clerkUser = await currentUser();
    } catch (error) {
      console.log("[getSafeProfile] Could not fetch currentUser:", error);
      // Continue with basic email lookup
    }
    const userEmail = clerkUser?.emailAddresses?.[0]?.emailAddress || "";

    const convex = getConvexClient();
    
    // Try to fetch user from Convex using clerkId
    const profile = await convex.query(api.user.getSafeProfile, {
      clerkId: userId,
    });

    if (profile) {
      console.log("[getSafeProfile] Found profile with role:", profile.role);
      return profile;
    }

    // User doesn't exist in Convex with this clerkId
    // Check if there's already an account with this email to prevent duplicates
    console.log("[getSafeProfile] User not found by clerkId, checking by email:", userEmail);
    
    if (userEmail) {
      try {
        const existingByEmail = await convex.query(api.user.getByEmail, {
          email: userEmail,
        });
        
        if (existingByEmail) {
          console.log("[getSafeProfile] Found existing user by email, updating clerkId");
          // Update the clerkId for the existing user
          try {
            await convex.mutation(api.user.update, {
              userId: existingByEmail._id,
              clerkId: userId,
            });
          } catch (updateError) {
            console.log("[getSafeProfile] Could not update clerkId:", updateError);
          }
          return existingByEmail;
        }
      } catch (error) {
        console.log("[getSafeProfile] Could not query by email:", error);
      }
    }

    // User doesn't exist at all, create new one
    console.log("[getSafeProfile] User not found, creating as student");
    const adminEmail = process.env.ADMIN_EMAIL;
    const isAdmin = adminEmail && userEmail === adminEmail;
    
    const userRole = isAdmin ? "admin" : "student";
    
    try {
      await convex.mutation(api.user.create, {
        clerkId: userId,
        email: userEmail,
        firstName: clerkUser?.firstName || "",
        lastName: clerkUser?.lastName || "",
        role: userRole,
      });
      
      return {
        _id: "" as any,
        clerkId: userId,
        email: userEmail,
        firstName: clerkUser?.firstName || "",
        lastName: clerkUser?.lastName || "",
        role: userRole,
        onboardingCompleted: false,
      };
    } catch (createError) {
      console.log("[getSafeProfile] Could not create user:", createError);
      return null;
    }
  } catch (error) {
    console.error("[getSafeProfile] Unexpected error:", error);
    return null;
  }
}
