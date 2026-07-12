/**
 * Next.js 16 Proxy (replaces middleware.ts)
 *
 * Handles authentication and role-based access control for protected routes.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/proxy
 */

import { NextResponse } from 'next/server';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { auth } from '@/auth';
import type { NextRequest } from 'next/server';

const SIGN_IN_PATH = '/signin';

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
function parseUserRole(
  rawRole: UserRole | string | number | null | undefined,
): UserRole | null {
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

function redirectToSignIn(request: NextRequest, callbackPath?: string) {
  const signInUrl = new URL(SIGN_IN_PATH, request.url);
  if (callbackPath && callbackPath !== SIGN_IN_PATH) {
    signInUrl.searchParams.set('callbackUrl', callbackPath);
  }
  return NextResponse.redirect(signInUrl);
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
    return redirectToSignIn(request, pathname);
  }

  // Parse and validate role
  const userRole = parseUserRole(session.user?.role);
  if (userRole === null) {
    return redirectToSignIn(request, pathname);
  }

  // Authorize
  if (!hasAccess(pathname, userRole)) {
    return NextResponse.redirect(new URL('/error/forbidden', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*', '/error/:path*'],
};
