'use client';

import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { UserRole } from '@/app/_lib/Enums/UserRole';

export const useUserPermissions = () => {
  const { data: session } = useSession();

  const roleValue: UserRole | null = useMemo(() => {
    const rawRole = session?.user?.role;
    if (typeof rawRole === 'number') return rawRole as UserRole;
    if (typeof rawRole === 'string') {
      const parsed = Number.parseInt(rawRole, 10);
      return Number.isNaN(parsed) ? null : (parsed as UserRole);
    }
    return null;
  }, [session?.user?.role]);

  const canManage = useMemo(
    () =>
      roleValue === UserRole.Admin ||
      roleValue === UserRole.Instructor ||
      roleValue === UserRole.PlatformAdmin,
    [roleValue]
  );

  const institutionId =
    typeof session?.user?.institutionId === 'string'
      ? session?.user?.institutionId
      : undefined;

  return {
    canManage,
    institutionId,
    roleValue,
  };
};
