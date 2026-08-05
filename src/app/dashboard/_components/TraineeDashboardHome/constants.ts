import type { TraineeInsightId } from '@/app/_lib/types/dashboardInsights';

export const TITLE = 'My learning';
export const DESCRIPTION =
  'Tap a tile for progress history, due lists, and exam detail.';

export const INSIGHT_TITLES: Record<TraineeInsightId, string> = {
  progress: 'Your progress',
  activity: 'Your activity',
  workload: 'Assignment load',
  nextDue: 'Next due',
  nextExam: 'Next exam',
};

export const INSIGHT_SUBTITLES: Record<TraineeInsightId, string> = {
  progress: 'Grades and recent scored work',
  activity: 'How you engage with content',
  workload: 'Due soon vs overdue',
  nextDue: 'Upcoming assignments',
  nextExam: 'Scheduled exams',
};

export const NEXT_DUE_EMPTY = 'Nothing due right now.';
export const ACTIVITY_EMPTY = 'No recent activity events yet.';
export const GRADED_EMPTY = 'No recently graded modules yet.';
export const EXAM_EMPTY = 'No upcoming exams scheduled.';
export const DETAIL_LOAD_ERROR = 'Could not load this insight. Try again.';
