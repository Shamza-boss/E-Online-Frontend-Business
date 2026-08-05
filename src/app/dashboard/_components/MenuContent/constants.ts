import { UserRole } from '@/app/_lib/Enums/UserRole';

export const PLATFORM_OWNER_ROLE = UserRole.PlatformAdmin;
export const PLATFORM_ONLY_ROUTES = ['institutions', 'billing'] as const;
export const FULL_ACCESS_ROLES: UserRole[] = [UserRole.Admin, UserRole.Instructor];
export const STUDENT_ALLOWED_ROUTES = ['', 'courses', 'library', 'settings'] as const;
export const SETTINGS_ROUTE = 'settings';

export const MAIN_ROUTES = [
  '',
  'institutions',
  'billing',
  'management',
  'manage-courses',
  'courses',
  'library',
] as const;

export const SECONDARY_ROUTES = [{ text: 'Settings', route: SETTINGS_ROUTE }] as const;
