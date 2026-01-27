"use server";

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getUserById(userId: string) {
  try {
    const user = await convex.query(api.user.getById, {
      userId: userId as Id<"users">,
    });
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
