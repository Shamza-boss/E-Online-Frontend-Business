import 'server-only';

import { cache } from 'react';
import type { SettingsResponseDto } from '../interfaces/types';
import { serverFetch } from '../serverFetch.server';
import { CACHE_TAGS } from './tags';

export const getMySettings = cache(async (): Promise<SettingsResponseDto> => {
  return serverFetch<SettingsResponseDto>('/settings/me', {
    method: 'GET',
    tags: [CACHE_TAGS.settings],
    revalidate: 60,
  });
});
