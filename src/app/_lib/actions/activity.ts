'use server';

import { serverFetch } from '../serverFetch.server';

/** Records a Login activity event + bumps LastSeenAt on the backend. */
export async function postAuthHeartbeat(): Promise<void> {
  await serverFetch<void>('/auth/heartbeat', {
    method: 'POST',
  });
}
