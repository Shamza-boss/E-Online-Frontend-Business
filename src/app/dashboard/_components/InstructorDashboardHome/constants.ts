import type { InstructorInsightId } from '@/app/_lib/types/dashboardInsights';

export const TITLE = 'My teaching';
export const DESCRIPTION =
  'Actionable insights for your classes — open a tile when there is more to review.';

export const INSIGHT_TITLES: Record<InstructorInsightId, string> = {
  workload: 'My module actions',
  atRisk: 'At-risk trainees',
  unassigned: 'Unassigned students',
  heavyLoad: 'Heavy assessment load',
};

export const INSIGHT_SUBTITLES: Record<InstructorInsightId, string> = {
  workload: 'Drafts, scheduled exams, and expiry needing your attention',
  atRisk: 'Inactive or overdue trainees who need a nudge',
  unassigned: 'Institution students not enrolled in any class',
  heavyLoad: '4+ open assessments due within any 7-day window',
};

export const ACTIONS_EMPTY = 'No drafts, schedules, or expiry work waiting on you.';
export const AT_RISK_EMPTY = 'No at-risk trainees in your classes right now.';
export const UNASSIGNED_EMPTY = 'Every student is assigned to a class.';
export const HEAVY_LOAD_EMPTY = 'No students are under heavy assessment load.';
export const DETAIL_LOAD_ERROR = 'Could not load this insight. Try again.';
