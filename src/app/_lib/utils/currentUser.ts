import { auth } from '@/auth';

/**
 * Fetch the active session and return normalized user claim set.
 * Adds safe defaults and keeps legacy id mapping.
 */
export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user) return null;
  const u = session.user;
  return {
    id: u.id,
    userId: u.userId ?? u.id,
    email: u.email,
    firstName: u.firstName ?? null,
    lastName: u.lastName ?? null,
    role: u.role ?? null,
    institutionId: u.institutionId ?? null,
    institutionName: u.institutionName ?? null,
  } as const;
}
