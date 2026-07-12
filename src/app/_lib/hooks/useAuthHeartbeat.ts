'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { postAuthHeartbeat } from '@/app/_lib/actions/activity';

/**
 * Fires a single Login heartbeat per browser tab session once authenticated.
 */
export function useAuthHeartbeat() {
  const { status } = useSession();
  const sentRef = useRef(false);

  useEffect(() => {
    if (status !== 'authenticated' || sentRef.current) return;
    sentRef.current = true;
    void postAuthHeartbeat().catch(() => {
      // Presence must not break the dashboard.
      sentRef.current = false;
    });
  }, [status]);
}
