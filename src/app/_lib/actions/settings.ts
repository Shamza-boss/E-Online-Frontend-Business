'use server';

import { serverFetch } from '../serverFetch';
import type { SettingsResponseDto } from '../interfaces/types';

export async function getMySettings() {
  return serverFetch<SettingsResponseDto>('/settings/me', {
    method: 'GET',
  });
}
