import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { UserRole } from "./generated/prisma";

// First, handle public routes that don't need auth checks
export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  console.log("Middleware: Processing path:", path);

  // Define public routes that don't need auth
  const publicRoutes = ["/api/seed"];
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));

  // Skip auth check for public routes
  if (isPublicRoute) {
    console.log("Middleware: Public route, allowing");
    return NextResponse.next();
  }

  // Skip auth check for API auth routes to prevent loops
  if (path.startsWith("/api/auth")) {
    console.log("Middleware: Auth route, allowing");
    return NextResponse.next();
  }

  // Get the token using next-auth/jwt
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("Middleware: Token found:", !!token, "Path:", path);

  // Handle authentication logic
  const isRootRoute = path === "/";
  const isAuthRoute = path === "/login";
  const isDashboardRoute = path.startsWith("/dashboard");
  const isAdminRoute = path.startsWith("/admin");
  const isFacilityRoute = path.startsWith("/facility");
  const isApiRoute = path.startsWith("/api/");

  // If user is on root page but not authenticated, redirect to login
  if (isRootRoute && !token) {
    console.log("Middleware: Root route without token, redirecting to login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If user is on root page and authenticated, redirect based on role
  if (isRootRoute && token) {
    if (token.role === UserRole.facility) {
      return NextResponse.redirect(new URL("/facility/dashboard", req.url));
    } else if (token.role === UserRole.admin) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    // Default fallback
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // If user is on login page but already authenticated, redirect based on role
  if (isAuthRoute && token) {
    if (token.role === UserRole.facility) {
      return NextResponse.redirect(new URL("/facility/dashboard", req.url));
    } else if (token.role === UserRole.admin) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    // Default fallback
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // If user is trying to access protected routes without auth, redirect to login
  if ((isDashboardRoute || isAdminRoute || isFacilityRoute) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect dashboard routes to admin routes (only for admin users)
  if (
    isDashboardRoute &&
    token &&
    token.role === UserRole.admin &&
    !req.headers.get("x-middleware-rewrite")
  ) {
    // Redirect /dashboard to /admin only for admin users
    if (path === "/dashboard") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    // Redirect other dashboard paths to admin
    if (path.startsWith("/dashboard/")) {
      const newPath = path.replace("/dashboard", "/admin");
      return NextResponse.redirect(new URL(newPath, req.url));
    }
  }

  // Route protection based on user role
  if (token) {
    // Admin routes - only admin users can access
    if (isAdminRoute && token.role !== UserRole.admin) {
      return NextResponse.redirect(new URL("/facility/dashboard", req.url));
    }

    // Facility routes - only facility users can access
    if (isFacilityRoute && token.role !== UserRole.facility) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // For API routes, allow them to pass through if we have a token
  // The individual API routes will handle their own authentication
  if (isApiRoute && token) {
    console.log("Middleware: API route with token, allowing");
    return NextResponse.next();
  }

  // For API routes without token, let them pass through
  // The individual API routes will handle unauthorized responses
  if (isApiRoute) {
    console.log(
      "Middleware: API route without token, allowing (will be handled by route)"
    );
    return NextResponse.next();
  }

  console.log("Middleware: Default case, allowing");
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/admin/:path*",
    "/facility/:path*",
    "/login",
    "/api/:path*",
  ],
};
