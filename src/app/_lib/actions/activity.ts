'use server';

import { serverFetch } from '../serverFetch.server';
import type { ContentActivityEventType } from '../types/dashboardInsights';

/** Records a Login activity event + bumps LastSeenAt on the backend. */
export async function postAuthHeartbeat(): Promise<void> {
  await serverFetch<void>('/auth/heartbeat', {
    method: 'POST',
  });
}

/** Fire-and-forget content engagement event. */
export async function recordActivityEvent(
  eventType: ContentActivityEventType,
  source?: string,
): Promise<void> {
  await serverFetch<void>('/activity/events', {
    method: 'POST',
    body: JSON.stringify({ eventType, source: source ?? 'web' }),
  });
}
