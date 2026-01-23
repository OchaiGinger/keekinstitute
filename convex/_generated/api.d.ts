/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as assessment from "../assessment.js";
import type * as attachments from "../attachments.js";
import type * as categories from "../categories.js";
import type * as chapters from "../chapters.js";
import type * as courses from "../courses.js";
import type * as onboarding from "../onboarding.js";
import type * as progress from "../progress.js";
import type * as studentCategories from "../studentCategories.js";
import type * as user from "../user.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  assessment: typeof assessment;
  attachments: typeof attachments;
  categories: typeof categories;
  chapters: typeof chapters;
  courses: typeof courses;
  onboarding: typeof onboarding;
  progress: typeof progress;
  studentCategories: typeof studentCategories;
  user: typeof user;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
