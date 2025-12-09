/**
 * Middleware Proxy
 *
 * Handles authentication and role-based access control for protected routes.
 * This runs on every matched request before the route handler.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware
 */

import { NextResponse } from 'next/server';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { auth } from '@/auth';
import type { NextRequest } from 'next/server';

// Route access rules - maps paths to allowed roles
const ACCESS_RULES: Readonly<Record<string, readonly UserRole[]>> = {
  '/dashboard/institutions': [UserRole.PlatformAdmin],
  '/dashboard/billing': [UserRole.PlatformAdmin],
  '/dashboard/management': [UserRole.Admin, UserRole.Instructor],
  '/dashboard/manage-courses': [UserRole.Admin, UserRole.Instructor],
  '/dashboard/courses': [UserRole.Admin, UserRole.Instructor, UserRole.Trainee],
  '/dashboard/library': [UserRole.Admin, UserRole.Instructor, UserRole.Trainee],
} as const;

// Error pages that require a referer
const PROTECTED_ERROR_PAGES = ['/error/forbidden', '/error/server-error'];

/**
 * Parse user role from session
 *
 * Handles both number and string representations of roles
 */
function parseUserRole(rawRole: unknown): UserRole | null {
  if (typeof rawRole === 'number') {
    return rawRole as UserRole;
  }

  if (typeof rawRole === 'string') {
    const trimmed = rawRole.trim();
    if (trimmed === '') return null;

    const parsed = parseInt(trimmed, 10);
    return Number.isNaN(parsed) ? null : (parsed as UserRole);
  }

  return null;
}

/**
 * Check if user role has access to a path
 */
function hasAccess(pathname: string, userRole: UserRole): boolean {
  for (const [rulePath, allowedRoles] of Object.entries(ACCESS_RULES)) {
    if (pathname.startsWith(rulePath)) {
      return allowedRoles.includes(userRole);
    }
  }
  // No rule = allow access
  return true;
}

/**
 * Middleware proxy function
 *
 * Validates authentication and authorization for protected routes
 */
export async function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const { pathname } = nextUrl;

  // Protect error pages from direct access
  if (PROTECTED_ERROR_PAGES.includes(pathname)) {
    const referer = request.headers.get('referer');
    if (!referer) {
      return NextResponse.rewrite(new URL('/not-found', request.url));
    }
    return NextResponse.next();
  }

  // Authenticate
  const session = await auth();
  if (!session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Parse and validate role
  const userRole = parseUserRole(session.user?.role);
  if (userRole === null) {
    // Force re-login if role is invalid
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Authorize
  if (!hasAccess(pathname, userRole)) {
    return NextResponse.redirect(new URL('/error/forbidden', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/error/:path*'],
};
