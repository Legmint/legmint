// middleware.ts (App Router + Clerk)
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Public routes that do NOT require auth
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/pricing',
  '/templates(.*)',
  '/about',
  '/contact',
  '/lawyers(.*)',
  '/legal(.*)',
  '/api/webhooks(.*)', // keep public if you have unauthenticated webhooks
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect everything that is not a public route
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

// Next.js matcher (skip static assets & _next/*, always run for /api & /trpc)
export const config = {
  matcher: [
    // Skip files with extensions and _next
    '/((?!.+\\.[\\w]+$|_next).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};