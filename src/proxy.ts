import { NextResponse } from 'next/server';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { auth } from '@/auth';
import type { NextRequest } from 'next/server';

// Map dashboard sub-paths to allowed roles
const accessRules: Record<string, UserRole[]> = {
  '/dashboard/institutions': [UserRole.PlatformAdmin],
  '/dashboard/management': [UserRole.Admin, UserRole.Instructor],
  '/dashboard/manage-courses': [UserRole.Admin, UserRole.Instructor],
  '/dashboard/courses': [UserRole.Admin, UserRole.Instructor, UserRole.Trainee],
};

// Next.js 16 proxy function
export async function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;

  // Allow direct navigation to error pages only if coming from somewhere
  if (pathname === '/error/forbidden' || pathname === '/error/server-error') {
    const referer = request.headers.get('referer');
    if (!referer) {
      return NextResponse.rewrite(new URL('/not-found', request.url));
    }
  }

  // Get session using NextAuth's auth() function
  const session = await auth();

  // Check if user is authenticated
  if (!session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Robust role extraction (could be number or string)
  const rawRole = session.user?.role;
  let userRole: UserRole | null = null;

  if (typeof rawRole === 'number') {
    userRole = rawRole as UserRole;
  } else if (rawRole != null && typeof rawRole === 'string') {
    const trimmed = String(rawRole).trim();
    if (trimmed !== '') {
      const parsed = parseInt(trimmed, 10);
      if (!Number.isNaN(parsed)) userRole = parsed as UserRole;
    }
  }

  if (userRole == null) {
    // If we cannot determine role, treat as unauthenticated (forces fresh login & enrichment)
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Path-based access control
  for (const rulePath in accessRules) {
    if (pathname.startsWith(rulePath)) {
      const allowedRoles = accessRules[rulePath];
      if (!allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL('/error/forbidden', request.url));
      }
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/error/:path*'],
};
