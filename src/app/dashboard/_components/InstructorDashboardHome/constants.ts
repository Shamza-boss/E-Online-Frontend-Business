import type { InstructorInsightId } from '@/app/_lib/types/dashboardInsights';

export const TITLE = 'My teaching';
export const DESCRIPTION =
  'Tap a tile for queue detail, trends, and at-risk trainees.';

export const INSIGHT_TITLES: Record<InstructorInsightId, string> = {
  submission: 'Class submission health',
  workload: 'Class workload',
  atRisk: 'At-risk trainees',
};

export const INSIGHT_SUBTITLES: Record<InstructorInsightId, string> = {
  submission: 'Rate and daily submission trend',
  workload: 'Pending grades and upcoming due',
  atRisk: 'People who need a nudge',
};

export const AT_RISK_EMPTY = 'No at-risk trainees in your classes right now.';
export const WORKLOAD_EMPTY = 'Nothing waiting in your grade queue.';
export const DETAIL_LOAD_ERROR = 'Could not load this insight. Try again.';
