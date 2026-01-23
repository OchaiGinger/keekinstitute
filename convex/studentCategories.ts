import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ------------------- CREATE STUDENT CATEGORY -------------------
export const create = mutation({
    args: {
        name: v.string(),
        description: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const categoryId = await ctx.db.insert("studentCategories", {
            name: args.name,
            description: args.description,
            createdAt: Date.now(),
        });
        return categoryId;
    },
});

// ------------------- GET ALL STUDENT CATEGORIES -------------------
export const getAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("studentCategories").collect();
    },
});

// ------------------- GET STUDENT CATEGORY BY ID -------------------
export const getById = query({
    args: { categoryId: v.id("studentCategories") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.categoryId);
    },
});

// ------------------- GET STUDENT CATEGORY BY NAME -------------------
export const getByName = query({
    args: { name: v.string() },
    handler: async (ctx, args) => {
        const categories = await ctx.db.query("studentCategories").collect();
        return categories.find((c) => c.name === args.name) ?? null;
    },
});

// ------------------- UPDATE STUDENT CATEGORY -------------------
export const update = mutation({
    args: {
        categoryId: v.id("studentCategories"),
        name: v.string(),
        description: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.categoryId, {
            name: args.name,
            description: args.description,
        });
        return args.categoryId;
    },
});

// ------------------- DELETE STUDENT CATEGORY -------------------
export const deleteCategory = mutation({
    args: { categoryId: v.id("studentCategories") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.categoryId);
        return args.categoryId;
    },
});
