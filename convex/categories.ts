import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ------------------- CREATE CATEGORY -------------------
export const create = mutation({
    args: { name: v.string() },
    handler: async (ctx, args) => {
        const categoryId = await ctx.db.insert("categories", {
            name: args.name,
            createdAt: Date.now(),
        });
        return categoryId;
    },
});

// ------------------- GET ALL CATEGORIES -------------------
export const getAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("categories").collect();
    },
});

// ------------------- GET CATEGORY BY ID -------------------
export const getById = query({
    args: { categoryId: v.id("categories") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.categoryId);
    },
});

// ------------------- GET CATEGORY BY NAME -------------------
export const getByName = query({
    args: { name: v.string() },
    handler: async (ctx, args) => {
        const categories = await ctx.db.query("categories").collect();
        return categories.find((c) => c.name === args.name) ?? null;
    },
});

// ------------------- UPDATE CATEGORY -------------------
export const update = mutation({
    args: {
        categoryId: v.id("categories"),
        name: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.categoryId, {
            name: args.name,
        });
        return args.categoryId;
    },
});

// ------------------- DELETE CATEGORY -------------------
export const deleteCategory = mutation({
    args: { categoryId: v.id("categories") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.categoryId);
        return args.categoryId;
    },
});
