'use client';

import { recordActivityEvent } from '@/app/_lib/actions/activity';
import type { ContentActivityEventType } from '@/app/_lib/types/dashboardInsights';

const fired = new Set<string>();

/** Best-effort content telemetry; never throws to callers. */
export function trackActivity(
  eventType: ContentActivityEventType,
  source?: string,
  dedupeKey?: string,
): void {
  const key = dedupeKey ?? `${eventType}:${source ?? 'web'}`;
  if (fired.has(key)) return;
  fired.add(key);
  void recordActivityEvent(eventType, source).catch(() => {
    fired.delete(key);
  });
}
