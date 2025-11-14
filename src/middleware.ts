import { NextResponse } from 'next/server';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { auth } from '@/auth';

// Map dashboard sub-paths to allowed roles
const accessRules: Record<string, UserRole[]> = {
  '/dashboard/institutions': [UserRole.PlatformAdmin],
  '/dashboard/management': [UserRole.Admin, UserRole.Instructor],
  '/dashboard/manage-courses': [UserRole.Admin, UserRole.Instructor],
  '/dashboard/courses': [UserRole.Admin, UserRole.Instructor, UserRole.Trainee],
  '/dashboard/settings': [UserRole.PlatformAdmin, UserRole.Admin],
};

// Use NextAuth middleware wrapper so we can access session via req.auth
export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  // Allow direct navigation to error pages only if coming from somewhere
  if (pathname === '/error/forbidden' || pathname === '/error/server-error') {
    const referer = req.headers.get('referer');
    if (!referer) {
      return NextResponse.rewrite(new URL('/not-found', req.url));
    }
  }

  const session = req.auth; // Provided by NextAuth wrapper
  if (!session) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Robust role extraction (could be number or string)
  const rawRole = (session.user as any)?.role;
  let userRole: UserRole | null = null;
  if (typeof rawRole === 'number') {
    userRole = rawRole as UserRole;
  } else if (typeof rawRole === 'string' && rawRole.trim() !== '') {
    const parsed = parseInt(rawRole, 10);
    if (!Number.isNaN(parsed)) userRole = parsed as UserRole;
  }

  if (userRole == null) {
    // If we cannot determine role, treat as unauthenticated (forces fresh login & enrichment)
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Path-based access control
  for (const rulePath in accessRules) {
    if (pathname.startsWith(rulePath)) {
      const allowedRoles = accessRules[rulePath];
      if (!allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL('/error/forbidden', req.url));
      }
    }
  }

  // Forward role to downstream (optional use in route handlers / pages)
  const res = NextResponse.next();
  return res;
});

export const config = {
  matcher: ['/dashboard/:path*', '/error/:path*'],
};
