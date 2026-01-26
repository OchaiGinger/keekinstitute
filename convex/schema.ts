import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ==================== USERS ====================
  users: defineTable({
    authUserId: v.string(), // Clerk user ID
    email: v.string(),
    name: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("instructor"), v.literal("student")), // User role
    onboardingCompleted: v.optional(v.boolean()),
    onboardingCompletedAt: v.optional(v.number()),
    // Student-specific fields
    studentType: v.optional(v.string()), // Student category type (dynamic from categories)
    careerInterest: v.optional(v.string()), // Student's career interest
    currentLevel: v.optional(v.union(v.literal("Beginner"), v.literal("Intermediate"), v.literal("Advanced"))), // Student's current skill level
    learningGoals: v.optional(v.string()), // Student's learning goals
    // Instructor-specific fields
    specialization: v.optional(v.string()),
    bio: v.optional(v.string()),
    qualifications: v.optional(v.string()),
    yearsOfExperience: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_authUserId", ["authUserId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  // ==================== ASSESSMENTS ====================
  assessments: defineTable({
    userId: v.id("users"),
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
    completedAt: v.number(),
    // Legacy fields - deprecated, can be removed after data cleanup
    authUserId: v.optional(v.string()),
    score: v.optional(v.number()),
    percentage: v.optional(v.number()),
    totalQuestions: v.optional(v.number()),
  })
    .index("by_userId", ["userId"]),

  // ==================== COURSES ====================
  courses: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
    price: v.optional(v.number()),
    isPublished: v.optional(v.boolean()),
    courseType: v.optional(v.string()), // Type of course (e.g., "IT", "Business", "General")
    targetStudentType: v.optional(v.array(v.union(v.literal("IT"), v.literal("External"), v.literal("KeekInstitute")))), // Target student types
    createdAt: v.number(),
  })
    .index("by_categoryId", ["categoryId"])
    .index("by_published", ["isPublished"]),

  // ==================== CATEGORIES ====================
  categories: defineTable({
    name: v.string(),
    createdAt: v.number(),
  }),

  // ==================== STUDENT CATEGORIES ====================
  studentCategories: defineTable({
    name: v.string(), // "IT Students", "External Students", "KeekInstitute Students"
    description: v.optional(v.string()),
    createdAt: v.number(),
  }),

  // ==================== CHAPTERS ====================
  chapters: defineTable({
    courseId: v.id("courses"),
    title: v.string(),
    description: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    position: v.number(),
    isPublished: v.optional(v.boolean()),
    isFree: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index("by_courseId", ["courseId"])
    .index("by_published", ["isPublished"]),

  // ==================== ATTACHMENTS ====================
  attachments: defineTable({
    courseId: v.id("courses"),
    url: v.string(),
    originalFilename: v.string(),
    createdAt: v.number(),
  })
    .index("by_courseId", ["courseId"]),

  // ==================== USER PROGRESS ====================
  userProgress: defineTable({
    userId: v.id("users"),
    chapterId: v.id("chapters"),
    isCompleted: v.boolean(),
    completedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_chapterId", ["chapterId"])
    .index("by_user_chapter", ["userId", "chapterId"]),

  // ==================== ENROLLMENTS ====================
  enrollments: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    enrolledAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_courseId", ["courseId"])
    .index("by_user_course", ["userId", "courseId"]),

  // ==================== ONBOARDINGS ====================
  onboardings: defineTable({
    authUserId: v.string(),
    name: v.optional(v.string()),
    completedAt: v.number(),
  })
    .index("by_authUserId", ["authUserId"]),
});
