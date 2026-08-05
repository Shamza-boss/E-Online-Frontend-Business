import type { AdminInsightId } from '@/app/_lib/types/dashboardInsights';

export const ADMIN_DASHBOARD_TITLE = 'Institution overview';
export const ADMIN_DASHBOARD_DESCRIPTION =
  'Glance the pulse — expand any tile for the full story.';

export const INSIGHT_TITLES: Record<AdminInsightId, string> = {
  presence: 'Presence',
  content: 'Content',
  engagement: 'Adoption',
  subjects: 'Subjects',
  grades: 'Grades',
  followUps: 'Follow-ups',
  modules: 'Modules',
};

export const INSIGHT_SUBTITLES: Record<AdminInsightId, string> = {
  presence: 'Who is showing up',
  content: 'Notes, modules, and media',
  engagement: 'Submission and adoption',
  subjects: 'Most active subjects',
  grades: 'Score bands',
  followUps: 'People to nudge',
  modules: 'Recent modules with due dates and submission rates',
};

/** Only content mix is missing from the institution home payload. */
export const ADMIN_REMOTE_INSIGHTS: ReadonlySet<AdminInsightId> = new Set(['content']);

export const FOLLOW_UP_EMPTY = 'No inactive instructors or trainees in the last 30 days.';
export const NEVER_LOGGED_IN_EMPTY = 'Everyone has logged in at least once.';
export const DETAIL_LOAD_ERROR = 'Could not load this insight. Try again.';
