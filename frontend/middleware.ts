import { authMiddleware } from "@clerk/nextjs";

// Public routes that do NOT require auth
const publicRoutes = [
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/pricing",
  "/legal(.*)",
  "/templates",
  "/about",
  "/contact",
  "/lawyers(.*)",
  "/admin(.*)",           // keep public if admin has its own auth gate later
  "/api/webhooks(.*)",    // webhooks shouldn't be blocked by auth middleware
];

// Use Clerk's high-level middleware (handles edge/runtime safely)
export default authMiddleware({
  publicRoutes,
});

// Run middleware on everything except Next internals & static assets
export const config = {
  matcher: [
    // exclude Next internals and static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|ico|webp|css|js|map)$).*)",
  ],
};