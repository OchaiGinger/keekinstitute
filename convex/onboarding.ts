import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
    args: {
        authUserId: v.string(),
        name: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("onboardings", {
            authUserId: args.authUserId,
            name: args.name,
            completedAt: Date.now(),
        });
    },
});

export const getByAuthId = query({
    args: {
        authUserId: v.string(),
    },
    handler: async (ctx, args) => {
        const items = await ctx.db.query("onboardings").collect();
        return items.find((i) => i.authUserId === args.authUserId) ?? null;
    },
});
