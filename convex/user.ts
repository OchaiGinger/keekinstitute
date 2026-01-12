import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ------------------- CREATE USER -------------------
export const create = mutation({
    args: {
        authUserId: v.string(),
        email: v.string(),
        name: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("users", {
            authUserId: args.authUserId,
            email: args.email,
            name: args.name,
            createdAt: Date.now(),
        });
    },
});

// ------------------- GET USER BY AUTH ID -------------------
export const getByAuthId = query({
    args: { authUserId: v.string() },
    handler: async (ctx, args) => {
        // Fallback implementation without relying on a DB index.
        const users = await ctx.db.query("users").collect();
        return users.find((u) => u.authUserId === args.authUserId) ?? null;
    },
});

// ------------------- COMPLETE ONBOARDING -------------------
export const completeOnboarding = mutation({
    args: {
        authUserId: v.string(),
        name: v.string(),
    },
    handler: async (ctx, args) => {
        // Try to find existing user (without requiring an index)
        const users = await ctx.db.query("users").collect();
        const user = users.find((u) => u.authUserId === args.authUserId);

        if (user) {
            await ctx.db.patch(user._id, {
                name: args.name,
                onboardingCompleted: true,
                onboardingCompletedAt: Date.now(),
            });
            return { updated: true };
        }

        // If no user exists, create and mark onboarding complete
        await ctx.db.insert("users", {
            authUserId: args.authUserId,
            name: args.name,
            onboardingCompleted: true,
            onboardingCompletedAt: Date.now(),
            createdAt: Date.now(),
        });

        return { created: true };
    },
});
