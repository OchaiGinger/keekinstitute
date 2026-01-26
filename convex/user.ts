import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ------------------- CREATE USER -------------------
export const create = mutation({
    args: {
        authUserId: v.string(),
        email: v.string(),
        name: v.optional(v.string()),
        role: v.optional(v.union(v.literal("admin"), v.literal("instructor"), v.literal("student"))),
    },
    handler: async (ctx, args) => {
        const _id = await ctx.db.insert("users", {
            authUserId: args.authUserId,
            email: args.email,
            name: args.name,
            role: args.role || "student", // Default to student
            onboardingCompleted: false,
            createdAt: Date.now(),
        });
        return _id;
    },
});

// ------------------- GET USER BY AUTH ID -------------------
export const getByAuthId = query({
    args: { authUserId: v.string() },
    handler: async (ctx, args) => {
        // Fallback implementation without relying on a DB index.
        const users = await ctx.db.query("users").collect();
        return users.find((u) => u.authUserId === args.authUserId) ?? null;
    },
});

// ------------------- GET SAFE PROFILE (for layouts) -------------------
export const getSafeProfile = query({
    args: { authUserId: v.string() },
    handler: async (ctx, args) => {
        const users = await ctx.db.query("users").collect();
        const user = users.find((u) => u.authUserId === args.authUserId);

        if (!user) {
            return null;
        }

        return {
            _id: user._id,
            authUserId: user.authUserId,
            email: user.email,
            name: user.name,
            role: user.role,
            onboardingCompleted: user.onboardingCompleted,
        };
    },
});

// ------------------- GET USERS BY ROLE -------------------
export const getByRole = query({
    args: { role: v.union(v.literal("admin"), v.literal("instructor"), v.literal("student")) },
    handler: async (ctx, args) => {
        const users = await ctx.db.query("users").collect();
        return users.filter((u) => u.role === args.role);
    },
});

// ------------------- GET USER BY EMAIL -------------------
export const getByEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const users = await ctx.db.query("users").collect();
        return users.find((u) => u.email === args.email) ?? null;
    },
});

// ------------------- COMPLETE ONBOARDING -------------------
export const completeOnboarding = mutation({
    args: {
        authUserId: v.string(),
        email: v.string(),
        name: v.string(),
        role: v.optional(v.union(v.literal("admin"), v.literal("instructor"), v.literal("student"))),
    },
    handler: async (ctx, args) => {
        // Try to find existing user (without requiring an index)
        const users = await ctx.db.query("users").collect();
        const user = users.find((u) => u.authUserId === args.authUserId);

        if (user) {
            await ctx.db.patch(user._id, {
                name: args.name,
                role: args.role || user.role,
                onboardingCompleted: true,
                onboardingCompletedAt: Date.now(),
            });
            return { updated: true, userId: user._id };
        }

        // If no user exists, create and mark onboarding complete
        const _id = await ctx.db.insert("users", {
            authUserId: args.authUserId,
            email: args.email,
            name: args.name,
            role: args.role || "student",
            onboardingCompleted: true,
            onboardingCompletedAt: Date.now(),
            createdAt: Date.now(),
        });

        return { created: true, userId: _id };
    },
});

// ------------------- UPDATE INSTRUCTOR PROFILE -------------------
export const updateInstructorProfile = mutation({
    args: {
        authUserId: v.string(),
        specialization: v.string(),
        bio: v.optional(v.string()),
        qualifications: v.optional(v.string()),
        yearsOfExperience: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const users = await ctx.db.query("users").collect();
        const user = users.find((u) => u.authUserId === args.authUserId);

        if (!user) {
            throw new Error("User not found");
        }

        await ctx.db.patch(user._id, {
            specialization: args.specialization,
            bio: args.bio,
            qualifications: args.qualifications,
            yearsOfExperience: args.yearsOfExperience,
        });

        return { updated: true, userId: user._id };
    },
});
// ------------------- UPDATE STUDENT TYPE -------------------
export const updateStudentType = mutation({
    args: {
        userId: v.id("users"),
        studentType: v.union(v.literal("IT"), v.literal("External"), v.literal("KeekInstitute")),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);

        if (!user) {
            throw new Error("User not found");
        }

        await ctx.db.patch(args.userId, {
            studentType: args.studentType,
        });

        return { updated: true, userId: args.userId };
    },
});

// ------------------- UPDATE STUDENT ONBOARDING -------------------
export const updateStudentOnboarding = mutation({
    args: {
        userId: v.id("users"),
        studentType: v.string(),
        learningGoals: v.string(),
        onboardingCompleted: v.boolean(),
        onboardingCompletedAt: v.number(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);

        if (!user) {
            throw new Error("User not found");
        }

        await ctx.db.patch(args.userId, {
            studentType: args.studentType as any,
            learningGoals: args.learningGoals,
            onboardingCompleted: args.onboardingCompleted,
            onboardingCompletedAt: args.onboardingCompletedAt,
        });

        return { updated: true, userId: args.userId };
    },
});

// ------------------- UPDATE INSTRUCTOR ONBOARDING -------------------
export const updateInstructorOnboarding = mutation({
    args: {
        userId: v.id("users"),
        fullName: v.string(),
        specialization: v.string(),
        bio: v.string(),
        experience: v.string(),
        qualifications: v.string(),
        onboardingCompleted: v.boolean(),
        onboardingCompletedAt: v.number(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);

        if (!user) {
            throw new Error("User not found");
        }

        await ctx.db.patch(args.userId, {
            name: args.fullName,
            specialization: args.specialization,
            bio: args.bio,
            yearsOfExperience: parseInt(args.experience, 10) || 0,
            qualifications: args.qualifications,
            onboardingCompleted: args.onboardingCompleted,
            onboardingCompletedAt: args.onboardingCompletedAt,
        });

        return { updated: true, userId: args.userId };
    },
});