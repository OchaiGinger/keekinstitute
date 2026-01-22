import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/* ============ CLEANUP - DELETE BAD DOCUMENTS ============ */
export const cleanupOldAssessments = mutation({
    args: {},
    handler: async (ctx) => {
        // This removes old assessments with extra fields
        const assessments = await ctx.db.query("assessments").collect();
        let deletedCount = 0;
        
        for (const assessment of assessments) {
            // Check if document has extra fields like authUserId, score, percentage
            const doc = assessment as any;
            if (doc.authUserId || doc.score || doc.percentage || doc.totalQuestions) {
                await ctx.db.delete(assessment._id);
                deletedCount++;
            }
        }
        
        return { deletedCount };
    },
});

/* ---------------- SUBMIT / RETAKE ASSESSMENT ---------------- */
export const submitAssessment = mutation({
    args: {
        authUserId: v.string(),
        recommendedPath: v.string(),
        pathScores: v.object({
            frontend: v.number(),
            backend: v.number(),
            fullstack: v.number(),
            data_science: v.number(),
            devops: v.number(),
        }),
        answers: v.array(
            v.object({
                questionId: v.number(),
                selectedOption: v.string(),
                selectedPath: v.string(),
            })
        ),
        analysis: v.string(),
    },
    handler: async (ctx, args) => {
        // Find user by authUserId
        const users = await ctx.db.query("users").collect();
        const user = users.find((u) => u.authUserId === args.authUserId);
        if (!user) throw new Error("User not found");

        // Find existing assessment for this user
        const assessments = await ctx.db.query("assessments").collect();
        const existing = assessments.find(
            (a) => a.userId === user._id
        );

        const assessmentData = {
            userId: user._id,
            recommendedPath: args.recommendedPath,
            pathScores: args.pathScores,
            answers: args.answers,
            analysis: args.analysis,
            completedAt: Date.now(),
        };

        if (existing) {
            await ctx.db.patch(existing._id, assessmentData);
            return { updated: true };
        }

        await ctx.db.insert("assessments", assessmentData);
        return { created: true };
    },
});

/* ---------------- GET LATEST (BY USER ID) ---------------- */
export const getLatestAssessmentByUserId = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const assessments = await ctx.db.query("assessments").collect();

        return (
            assessments
                .filter((a) => a.userId === args.userId)
                .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))[0] ?? null
        );
    },
});

/* ---------------- GET ALL FOR USER ---------------- */
export const getAllAssessmentsByUserId = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const assessments = await ctx.db.query("assessments").collect();

        return assessments
            .filter((a) => a.userId === args.userId)
            .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));
    },
});

/* ---------------- DELETE LATEST ---------------- */
export const deleteLatestAssessmentByUserId = mutation({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const assessments = await ctx.db.query("assessments").collect();

        const latest = assessments
            .filter((a) => a.userId === args.userId)
            .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))[0];

        if (latest) {
            await ctx.db.delete(latest._id);
        }

        return { success: true };
    },
});

/* No longer needed - use getLatestAssessmentByUserId instead */
