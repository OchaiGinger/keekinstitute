"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export async function deleteUserFromClerk(clerkUserId: string) {
  try {
    const { userId: adminId } = await auth();

    if (!adminId) {
      throw new Error("Not authenticated");
    }

    // Get Clerk client and delete the user
    const client = await clerkClient();
    await client.users.deleteUser(clerkUserId);

    return { success: true, message: "User deleted from Clerk" };
  } catch (error: any) {
    console.error("[deleteUserFromClerk] Error:", error);
    // Handle 404 gracefully - user might already be deleted
    if (error.status === 404) {
      console.log("[deleteUserFromClerk] User not found in Clerk (already deleted)");
      return { success: true, message: "User already deleted from Clerk" };
    }
    throw new Error(error.message || "Failed to delete user from Clerk");
  }
}
