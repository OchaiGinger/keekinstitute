import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        const enrollments = await ctx.db
            .query("enrollments")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .collect();

        // Fetch course details for each enrollment
        const enrollmentsWithCourses = await Promise.all(
            enrollments.map(async (enrollment) => {
                const course = await ctx.db.get(enrollment.courseId);
                return {
                    ...enrollment,
                    course,
                };
            })
        );

        return enrollmentsWithCourses;
    },
});

export const getByCourse = query({
    args: { courseId: v.id("courses") },
    handler: async (ctx, { courseId }) => {
        const enrollments = await ctx.db
            .query("enrollments")
            .withIndex("by_courseId", (q) => q.eq("courseId", courseId))
            .collect();

        return enrollments;
    },
});

export const create = mutation({
    args: { userId: v.id("users"), courseId: v.id("courses") },
    handler: async (ctx, { userId, courseId }) => {
        // Check if enrollment already exists
        const existing = await ctx.db
            .query("enrollments")
            .withIndex("by_user_course", (q) =>
                q.eq("userId", userId).eq("courseId", courseId)
            )
            .first();

        if (existing) {
            return existing;
        }

        // Create new enrollment
        const enrollmentId = await ctx.db.insert("enrollments", {
            userId,
            courseId,
            enrolledAt: Date.now(),
        });

        return { _id: enrollmentId, userId, courseId, enrolledAt: Date.now() };
    },
});

export const delete_ = mutation({
    args: { enrollmentId: v.id("enrollments") },
    handler: async (ctx, { enrollmentId }) => {
        await ctx.db.delete(enrollmentId);
        return { success: true };
    },
});
