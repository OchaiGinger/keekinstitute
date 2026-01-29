import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ------------------- CREATE USER -------------------
export const create = mutation({
    args: {
        clerkId: v.string(),
        email: v.string(),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        role: v.optional(v.union(v.literal("admin"), v.literal("instructor"), v.literal("student"))),
    },
    handler: async (ctx, args) => {
        const _id = await ctx.db.insert("users", {
            clerkId: args.clerkId,
            email: args.email,
            firstName: args.firstName,
            lastName: args.lastName,
            role: args.role || "student", // Default to student
            onboardingCompleted: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
        return _id;
    },
});

// ------------------- GET USER BY CLERK ID -------------------
export const getByClerkId = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const users = await ctx.db.query("users").collect();
        // Check both clerkId and authUserId for backward compatibility
        return users.find((u) => u.clerkId === args.clerkId || u.authUserId === args.clerkId) ?? null;
    },
});

// ------------------- GET USER BY ID -------------------
export const getById = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.userId);
    },
});

// ------------------- GET SAFE PROFILE (for layouts) -------------------
export const getSafeProfile = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const users = await ctx.db.query("users").collect();
        // Check both clerkId and authUserId for backward compatibility
        const user = users.find((u) => u.clerkId === args.clerkId || u.authUserId === args.clerkId);

        if (!user) {
            return null;
        }

        return {
            _id: user._id,
            clerkId: user.clerkId || user.authUserId,
            email: user.email,
            firstName: user.firstName || user.name,
            lastName: user.lastName,
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
        clerkId: v.string(),
        email: v.string(),
        firstName: v.string(),
        lastName: v.optional(v.string()),
        role: v.optional(v.union(v.literal("admin"), v.literal("instructor"), v.literal("student"))),
    },
    handler: async (ctx, args) => {
        // Try to find existing user (without requiring an index)
        const users = await ctx.db.query("users").collect();
        const user = users.find((u) => u.clerkId === args.clerkId);

        if (user) {
            await ctx.db.patch(user._id, {
                firstName: args.firstName,
                lastName: args.lastName,
                role: args.role || user.role,
                onboardingCompleted: true,
                onboardingCompletedAt: Date.now(),
                updatedAt: Date.now(),
            });
            return { updated: true, userId: user._id };
        }

        // If no user exists, create and mark onboarding complete
        const _id = await ctx.db.insert("users", {
            clerkId: args.clerkId,
            email: args.email,
            firstName: args.firstName,
            lastName: args.lastName,
            role: args.role || "student",
            onboardingCompleted: true,
            onboardingCompletedAt: Date.now(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        return { created: true, userId: _id };
    },
});

// ------------------- UPDATE INSTRUCTOR PROFILE -------------------
export const updateInstructorProfile = mutation({
    args: {
        clerkId: v.string(),
        specialization: v.string(),
        bio: v.optional(v.string()),
        qualifications: v.optional(v.string()),
        yearsOfExperience: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const users = await ctx.db.query("users").collect();
        const user = users.find((u) => u.clerkId === args.clerkId);

        if (!user) {
            throw new Error("User not found");
        }

        await ctx.db.patch(user._id, {
            specialization: args.specialization,
            bio: args.bio,
            qualifications: args.qualifications,
            yearsOfExperience: args.yearsOfExperience,
            updatedAt: Date.now(),
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
            firstName: args.fullName,
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

// ------------------- UPDATE ROLE (for admin check) -------------------
export const updateRole = mutation({
    args: {
        userId: v.id("users"),
        role: v.union(v.literal("admin"), v.literal("instructor"), v.literal("student")),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);

        if (!user) {
            throw new Error("User not found");
        }

        await ctx.db.patch(args.userId, {
            role: args.role,
        });

        return { updated: true, userId: args.userId, newRole: args.role };
    },
});

// ------------------- DELETE USER -------------------
export const deleteUser = mutation({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);

        if (!user) {
            throw new Error("User not found");
        }

        await ctx.db.delete(args.userId);

        return { deleted: true, userId: args.userId };
    },
});

// ------------------- UPDATE USER PROFILE -------------------
export const updateUserProfile = mutation({
    args: {
        userId: v.id("users"),
        updates: v.object({
            role: v.optional(v.union(v.literal("admin"), v.literal("instructor"), v.literal("student"))),
            name: v.optional(v.string()),
            email: v.optional(v.string()),
            onboardingCompleted: v.optional(v.boolean()),
        }),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);

        if (!user) {
            throw new Error("User not found");
        }

        const updates: any = {};
        if (args.updates.role !== undefined) updates.role = args.updates.role;
        if (args.updates.name !== undefined) updates.name = args.updates.name;
        if (args.updates.email !== undefined) updates.email = args.updates.email;
        if (args.updates.onboardingCompleted !== undefined) updates.onboardingCompleted = args.updates.onboardingCompleted;

        await ctx.db.patch(args.userId, updates);

        return { updated: true, userId: args.userId };
    },
});
