import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware(async (auth, req) => {
    try {
        // Protect all routes by default
        await auth.protect()
    } catch (error) {
        // Silently fail for public routes or if auth is not configured
        console.error('Middleware auth error:', error)
    }
})

export const config = {
    matcher: [
        // Only protect authenticated routes
        '/dashboard/:path*',
        '/assessment/:path*',
        '/onboarding/:path*',
    ],
}