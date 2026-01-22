import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ------------------- RECORD PROGRESS -------------------
export const recordProgress = mutation({
    args: {
        userId: v.id("users"),
        chapterId: v.id("chapters"),
    },
    handler: async (ctx, args) => {
        // Check if progress already exists
        const existing = await ctx.db
            .query("userProgress")
            .filter((q) =>
                q.and(
                    q.eq(q.field("userId"), args.userId),
                    q.eq(q.field("chapterId"), args.chapterId)
                )
            )
            .first();

        if (existing && existing.isCompleted) {
            return existing._id; // Already completed
        }

        if (existing) {
            await ctx.db.patch(existing._id, {
                isCompleted: true,
                completedAt: Date.now(),
            });
            return existing._id;
        }

        const _id = await ctx.db.insert("userProgress", {
            userId: args.userId,
            chapterId: args.chapterId,
            isCompleted: true,
            completedAt: Date.now(),
        });

        return _id;
    },
});

// ------------------- GET PROGRESS FOR A USER IN A COURSE -------------------
export const getProgressByCourse = query({
    args: {
        userId: v.id("users"),
        courseId: v.id("courses"),
    },
    handler: async (ctx, args) => {
        // Get all chapters for the course
        const chapters = await ctx.db
            .query("chapters")
            .filter((q) => q.eq(q.field("courseId"), args.courseId))
            .collect();

        // Get user progress for these chapters
        const progress = await ctx.db
            .query("userProgress")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .collect();

        // Calculate completion
        const completedCount = progress.filter((p) =>
            chapters.some((c) => c._id === p.chapterId && p.isCompleted)
        ).length;

        return {
            totalChapters: chapters.length,
            completedChapters: completedCount,
            progressPercentage: chapters.length > 0 
                ? Math.round((completedCount / chapters.length) * 100)
                : 0,
        };
    },
});

// ------------------- GET USER PROGRESS RECORDS -------------------
export const getByUserId = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const progress = await ctx.db
            .query("userProgress")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .collect();
        return progress;
    },
});

// ------------------- GET CHAPTER PROGRESS -------------------
export const getByChapterId = query({
    args: { chapterId: v.id("chapters") },
    handler: async (ctx, args) => {
        const progress = await ctx.db
            .query("userProgress")
            .filter((q) => q.eq(q.field("chapterId"), args.chapterId))
            .collect();
        return progress;
    },
});
