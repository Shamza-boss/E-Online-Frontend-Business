import type { DefaultSession } from 'next-auth';
import type { UserRole } from './src/app/_lib/Enums/UserRole';
import type {
  SubscriptionPlan,
  UserDto,
} from './src/app/_lib/interfaces/types';

// A narrowed subset of UserDto we store on session & token (id kept for convenience)
export type AuthUserClaims = {
  id: string; // internal id/sub
  userId?: string; // backend user id
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole | null;
  institutionId?: string;
  institutionName?: string;
  subscription?: string | null;
  subscriptionLabel?: string | null;
  subscriptionPlan?: SubscriptionPlan | null;
  creatorEnabled?: boolean;
  isInstitutionActive?: boolean | null;
  primaryAdminEmail?: string | null;
};

declare module 'next-auth' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- module augmentation requires interface
  interface Session {
    user: DefaultSession['user'] & AuthUserClaims;
    apiAccessToken?: string;
  }

  // Returned by adapter (Prisma) on first sign in; align with our claims
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- module augmentation requires interface
  interface User extends Omit<AuthUserClaims, 'id'> {}
}

declare module 'next-auth/jwt' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- module augmentation requires interface
  interface JWT extends Partial<AuthUserClaims> {
    appUserId?: string; // legacy
    institutionName?: string;
    apiAccessToken?: string;
  }
}

declare module 'next-auth/react' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- module augmentation requires interface
  interface Session {
    user: DefaultSession['user'] & AuthUserClaims;
    apiAccessToken?: string;
  }
}
