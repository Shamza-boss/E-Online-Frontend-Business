import type { DefaultSession } from 'next-auth';
import type { UserRole } from './src/app/_lib/Enums/UserRole';
import type { UserDto } from './src/app/_lib/interfaces/types';

// A narrowed subset of UserDto we store on session & token (id kept for convenience)
export interface AuthUserClaims {
  id: string; // internal id/sub
  userId?: string; // backend user id
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole | null;
  institutionId?: string;
  institutionName?: string;
}

declare module 'next-auth' {
  interface Session {
    user: AuthUserClaims & DefaultSession['user'];
  }

  // Returned by adapter (Prisma) on first sign in; align with our claims
  interface User extends Omit<AuthUserClaims, 'id'> {}
}

declare module 'next-auth/jwt' {
  interface JWT extends Partial<AuthUserClaims> {
    appUserId?: string; // legacy
    institutionName?: string;
  }
}
