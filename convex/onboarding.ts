import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
    args: {
        clerkId: v.string(),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("onboardings", {
            clerkId: args.clerkId,
            firstName: args.firstName,
            lastName: args.lastName,
            completedAt: Date.now(),
        });
    },
});

export const getByClerkId = query({
    args: {
        clerkId: v.string(),
    },
    handler: async (ctx, args) => {
        const items = await ctx.db.query("onboardings").collect();
        return items.find((i) => i.clerkId === args.clerkId) ?? null;
    },
});
