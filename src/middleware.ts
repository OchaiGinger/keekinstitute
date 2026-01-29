import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/assessment(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // Protect dashboard and assessment routes
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Match all routes except static assets
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|webp|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
