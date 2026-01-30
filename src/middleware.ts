import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Routes that REQUIRE authentication
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/assessment(.*)",
]);

export default clerkMiddleware((auth, req) => {
  // Protect only selected routes
  if (isProtectedRoute(req)) {
    auth.protect();
  }
});

// Run middleware on all app + API routes (excluding static assets)
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|webp|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
