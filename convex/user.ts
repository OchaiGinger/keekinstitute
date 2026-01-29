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

// ------------------- UPDATE USER -------------------
export const update = mutation({
    args: {
        userId: v.id("users"),
        clerkId: v.optional(v.string()),
        email: v.optional(v.string()),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        role: v.optional(v.union(v.literal("admin"), v.literal("instructor"), v.literal("student"))),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) {
            throw new Error("User not found");
        }

        const updates: any = { updatedAt: Date.now() };
        if (args.clerkId !== undefined) updates.clerkId = args.clerkId;
        if (args.email !== undefined) updates.email = args.email;
        if (args.firstName !== undefined) updates.firstName = args.firstName;
        if (args.lastName !== undefined) updates.lastName = args.lastName;
        if (args.role !== undefined) updates.role = args.role;

        await ctx.db.patch(args.userId, updates);
        return await ctx.db.get(args.userId);
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
// ------------------- GENERATE VERIFICATION ID (ADMIN) -------------------
export const generateVerificationId = mutation({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) throw new Error("User not found");

        // Generate ID with pattern: DD/MM/keek[sequential]
        // Example: 26/01/keek12, 26/01/keek13, etc.
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        
        // Get sequential number - count existing verifications today
        const users = await ctx.db.query("users").collect();
        const todaysIds = users
            .filter((u) => {
                if (!u.verificationId) return false;
                return u.verificationId.startsWith(`${day}/${month}/`);
            })
            .length;
        
        const sequential = String(todaysIds + 1).padStart(2, '0');
        const verificationId = `${day}/${month}/keek${sequential}`;

        await ctx.db.patch(args.userId, {
            verificationId,
            isVerified: true,
        });

        return { verificationId, userId: args.userId };
    },
});

// ------------------- VERIFY WITH ID (STUDENT) -------------------
export const verifyWithId = mutation({
    args: { clerkId: v.string(), verificationId: v.string() },
    handler: async (ctx, args) => {
        const users = await ctx.db.query("users").collect();
        const user = users.find((u) => u.clerkId === args.clerkId);

        if (!user) throw new Error("User not found");

        // Check if the verification ID matches
        if (user.verificationId !== args.verificationId) {
            throw new Error("Invalid verification ID");
        }

        if (!user.isVerified) {
            throw new Error("User not verified by admin");
        }

        // Mark as used
        await ctx.db.patch(user._id, {
            verificationIdUsed: true,
        });

        return { success: true, userId: user._id };
    },
});

// ------------------- GET ALL STUDENTS (ADMIN) -------------------
export const getAllStudents = query({
    handler: async (ctx) => {
        const students = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("role"), "student"))
            .collect();

        return students.map((student) => ({
            _id: student._id,
            clerkId: student.clerkId,
            email: student.email,
            firstName: student.firstName,
            lastName: student.lastName,
            isVerified: student.isVerified || false,
            verificationId: student.verificationId,
            verificationIdUsed: student.verificationIdUsed || false,
            onboardingCompleted: student.onboardingCompleted || false,
            createdAt: student.createdAt,
        }));
    },
});

// ------------------- DELETE USER (ADMIN) -------------------
export const deleteUser = mutation({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) throw new Error("User not found");

        // Delete all assessments for this user
        const assessments = await ctx.db.query("assessments").collect();
        for (const assessment of assessments) {
            if (assessment.userId === args.userId) {
                await ctx.db.delete(assessment._id);
            }
        }

        // Delete all enrollments for this user
        const enrollments = await ctx.db.query("enrollments").collect();
        for (const enrollment of enrollments) {
            if (enrollment.userId === args.userId) {
                await ctx.db.delete(enrollment._id);
            }
        }

        // Delete all progress records for this user
        const progresses = await ctx.db.query("userProgress").collect();
        for (const progress of progresses) {
            if (progress.userId === args.userId) {
                await ctx.db.delete(progress._id);
            }
        }

        // Delete the user itself
        await ctx.db.delete(args.userId);

        return { success: true, userId: args.userId };
    },
});

