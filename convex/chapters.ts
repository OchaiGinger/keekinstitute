import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ------------------- CREATE CHAPTER -------------------
export const create = mutation({
    args: {
        courseId: v.id("courses"),
        title: v.string(),
        description: v.optional(v.string()),
        videoUrl: v.optional(v.string()),
        position: v.number(),
    },
    handler: async (ctx, args) => {
        const _id = await ctx.db.insert("chapters", {
            courseId: args.courseId,
            title: args.title,
            description: args.description,
            videoUrl: args.videoUrl,
            position: args.position,
            isPublished: false,
            createdAt: Date.now(),
        });
        return _id;
    },
});

// ------------------- GET CHAPTER BY ID -------------------
export const getById = query({
    args: { chapterId: v.id("chapters") },
    handler: async (ctx, args) => {
        const chapter = await ctx.db.get(args.chapterId);
        return chapter;
    },
});

// ------------------- GET ALL CHAPTERS FOR A COURSE -------------------
export const getByCoursId = query({
    args: { courseId: v.id("courses") },
    handler: async (ctx, args) => {
        const chapters = await ctx.db
            .query("chapters")
            .filter((q) => q.eq(q.field("courseId"), args.courseId))
            .collect();
        return chapters.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    },
});

// Alias for consistency
export const getByCourse = getByCoursId;

// ------------------- GET PUBLISHED CHAPTERS FOR A COURSE -------------------
export const getPublishedByCoursId = query({
    args: { courseId: v.id("courses") },
    handler: async (ctx, args) => {
        const chapters = await ctx.db
            .query("chapters")
            .filter((q) => q.and(
                q.eq(q.field("courseId"), args.courseId),
                q.eq(q.field("isPublished"), true)
            ))
            .collect();
        return chapters.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    },
});

// ------------------- UPDATE CHAPTER -------------------
export const update = mutation({
    args: {
        chapterId: v.id("chapters"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        videoUrl: v.optional(v.string()),
        position: v.optional(v.number()),
        isPublished: v.optional(v.boolean()),
        isFree: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { chapterId, ...updates } = args;
        await ctx.db.patch(chapterId, updates);
        return chapterId;
    },
});

// ------------------- PUBLISH CHAPTER -------------------
export const publish = mutation({
    args: { chapterId: v.id("chapters") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.chapterId, { isPublished: true });
        return args.chapterId;
    },
});

// ------------------- DELETE CHAPTER -------------------
export const deleteChapter = mutation({
    args: { chapterId: v.id("chapters") },
    handler: async (ctx, args) => {
        // Delete all progress records for this chapter
        const progressRecords = await ctx.db
            .query("userProgress")
            .filter((q) => q.eq(q.field("chapterId"), args.chapterId))
            .collect();

        for (const record of progressRecords) {
            await ctx.db.delete(record._id);
        }

        // Delete chapter
        await ctx.db.delete(args.chapterId);
        return args.chapterId;
    },
});
