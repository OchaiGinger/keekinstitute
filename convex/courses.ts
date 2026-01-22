import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ------------------- CREATE COURSE -------------------
export const create = mutation({
    args: {
        title: v.string(),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        categoryId: v.optional(v.id("categories")),
    },
    handler: async (ctx, args) => {
        const _id = await ctx.db.insert("courses", {
            title: args.title,
            description: args.description,
            imageUrl: args.imageUrl,
            categoryId: args.categoryId,
            isPublished: false,
            createdAt: Date.now(),
        });
        return _id;
    },
});

// ------------------- GET COURSE BY ID -------------------
export const getById = query({
    args: { courseId: v.id("courses") },
    handler: async (ctx, args) => {
        const course = await ctx.db.get(args.courseId);
        return course;
    },
});

// ------------------- GET ALL PUBLISHED COURSES -------------------
export const getPublished = query({
    args: {},
    handler: async (ctx) => {
        const courses = await ctx.db
            .query("courses")
            .filter((q) => q.eq(q.field("isPublished"), true))
            .collect();
        return courses;
    },
});

// ------------------- UPDATE COURSE -------------------
export const update = mutation({
    args: {
        courseId: v.id("courses"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        price: v.optional(v.number()),
        categoryId: v.optional(v.id("categories")),
        isPublished: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { courseId, ...updates } = args;
        await ctx.db.patch(courseId, updates);
        return courseId;
    },
});

// ------------------- PUBLISH COURSE -------------------
export const publish = mutation({
    args: {
        courseId: v.id("courses"),
        isPublished: v.boolean(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.courseId, { isPublished: args.isPublished });
        return args.courseId;
    },
});

// ------------------- DELETE COURSE -------------------
export const deleteCourse = mutation({
    args: { courseId: v.id("courses") },
    handler: async (ctx, args) => {
        // Delete all chapters associated with this course
        const chapters = await ctx.db
            .query("chapters")
            .filter((q) => q.eq(q.field("courseId"), args.courseId))
            .collect();

        for (const chapter of chapters) {
            await ctx.db.delete(chapter._id);
        }

        // Delete course
        await ctx.db.delete(args.courseId);
        return args.courseId;
    },
});
