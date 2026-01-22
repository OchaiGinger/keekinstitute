import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ------------------- CREATE ATTACHMENT -------------------
export const create = mutation({
    args: {
        courseId: v.id("courses"),
        url: v.string(),
        originalFilename: v.string(),
    },
    handler: async (ctx, args) => {
        const _id = await ctx.db.insert("attachments", {
            courseId: args.courseId,
            url: args.url,
            originalFilename: args.originalFilename,
            createdAt: Date.now(),
        });
        return _id;
    },
});

// ------------------- GET ATTACHMENTS BY COURSE -------------------
export const getByCourse = query({
    args: { courseId: v.id("courses") },
    handler: async (ctx, args) => {
        const attachments = await ctx.db
            .query("attachments")
            .filter((q) => q.eq(q.field("courseId"), args.courseId))
            .collect();
        return attachments;
    },
});

// ------------------- DELETE ATTACHMENT -------------------
export const delete_ = mutation({
    args: { attachmentId: v.id("attachments") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.attachmentId);
        return args.attachmentId;
    },
});
