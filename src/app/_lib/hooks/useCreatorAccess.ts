'use client';

import { useSession } from 'next-auth/react';

interface CreatorAccess {
  creatorEnabled: boolean;
  loading: boolean;
  institutionName?: string | null;
}

export function useCreatorAccess(): CreatorAccess {
  const { data, status } = useSession();
  const creatorEnabled = Boolean(data?.user?.creatorEnabled);

  return {
    creatorEnabled,
    loading: status === 'loading',
    institutionName: data?.user?.institutionName ?? null,
  };
}
