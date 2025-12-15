/**
 * Client-safe settings actions
 * 
 * These wrappers use clientFetch instead of serverFetch,
 * making them safe to call from client components via SWR or useEffect.
 */

import { clientFetch } from '../services/clientFetch';
import type { SettingsResponseDto } from '../interfaces/types';

export async function getMySettingsClient(): Promise<SettingsResponseDto> {
  return clientFetch('/settings/me', {
    method: 'GET',
  });
}
