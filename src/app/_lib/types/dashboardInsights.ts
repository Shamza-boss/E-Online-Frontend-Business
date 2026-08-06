/** Insight detail payloads (until OpenAPI regen). */

import type { TeacherModuleActionDto } from './dashboardHome';

export type { TeacherModuleActionDto } from './dashboardHome';

export type NamedCountDto = { label?: string | null; value?: number };
export type DailyCountDto = { date?: string | null; count?: number };

export type FollowUpUserDetailDto = {
  userId?: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  role?: string | number;
  lastSeenAt?: string | null;
  firstLoginAt?: string | null;
  loginCountLast30Days?: number;
  reason?: string | null;
};

export type PendingGradeItemDto = {
  assignmentId?: string;
  moduleTitle?: string | null;
  traineeName?: string | null;
  submittedAt?: string | null;
};

export type UpcomingModuleDto = {
  homeworkId?: string;
  title?: string | null;
  dueDate?: string | null;
  isExam?: boolean;
};

export type GradedModuleDto = {
  homeworkId?: string;
  title?: string | null;
  score?: number;
  gradedAt?: string | null;
};

export type AdminPresenceInsightDto = {
  dailyActiveUsers?: DailyCountDto[] | null;
  loginEventsLast30Days?: number;
  sessionEventsLast30Days?: number;
  activeInstructorsLast30Days?: number;
  activeTraineesLast30Days?: number;
  neverLoggedIn?: FollowUpUserDetailDto[] | null;
};

export type AdminContentInsightDto = {
  eventMix?: NamedCountDto[] | null;
  dailyContentEvents?: DailyCountDto[] | null;
};

export type AdminEngagementInsightDto = {
  submissionRate?: number;
  avgNotePerStudent?: number;
  avgHomeworkAssigned?: number;
  notesCreatedSeries?: number[] | null;
  homeworkCreatedSeries?: number[] | null;
  dayLabels?: string[] | null;
  dailySubmissions?: DailyCountDto[] | null;
};

export type AdminSubjectsInsightDto = {
  mostActiveSubjects?: {
    labels?: string[] | null;
    series?: Array<{ id?: string; label?: string; data?: number[] | null }> | null;
  } | null;
};

export type AdminGradesInsightDto = {
  gradePerformance?: Array<{ label?: string | null; data?: number[] | null }> | null;
  gradePerformanceMonths?: string[] | null;
  gradePerformanceTrends?: { average?: number; color?: string | null } | null;
};

export type AdminFollowUpsInsightDto = {
  users?: FollowUpUserDetailDto[] | null;
};

export type AdminModulesInsightDto = {
  recentHomeworkStats?: unknown[] | null;
};

export type InstructorSubmissionInsightDto = {
  mySubmissionRate?: number;
  activeTraineesLast7Days?: number;
  dailySubmissions?: DailyCountDto[] | null;
  contentEventMix?: NamedCountDto[] | null;
};

export type InstructorWorkloadInsightDto = {
  drafts?: TeacherModuleActionDto[] | null;
  expiredDrafts?: TeacherModuleActionDto[] | null;
  scheduledExams?: TeacherModuleActionDto[] | null;
  expiringSoon?: TeacherModuleActionDto[] | null;
};

export type InstructorAtRiskInsightDto = {
  atRiskTrainees?: FollowUpUserDetailDto[] | null;
};

export type InstructorUnassignedInsightDto = {
  students?: Array<{
    userId?: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    lastSeenAt?: string | null;
  }> | null;
};

export type InstructorHeavyLoadInsightDto = {
  students?: Array<{
    userId?: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    peakDueCount?: number;
    classCount?: number;
    peakWindowStart?: string | null;
    peakWindowEnd?: string | null;
    reason?: string | null;
  }> | null;
};

export type TraineeProgressInsightDto = {
  myAverageGrade?: number;
  mySubmissionRate?: number;
  recentGraded?: GradedModuleDto[] | null;
};

export type TraineeActivityInsightDto = {
  eventMix?: NamedCountDto[] | null;
  dailyEvents?: DailyCountDto[] | null;
};

export type TraineeWorkloadInsightDto = {
  dueSoonCount?: number;
  overdueCount?: number;
  items?: Array<{
    assignmentId?: string;
    title?: string | null;
    dueDate?: string | null;
    isOverdue?: boolean;
    isExam?: boolean;
  }> | null;
};

export type TraineeNextDueInsightDto = {
  nextDue?: TraineeWorkloadInsightDto['items'];
};

export type TraineeNextExamInsightDto = {
  nextExamTitle?: string | null;
  nextExamScheduledAt?: string | null;
  upcomingExams?: UpcomingModuleDto[] | null;
};

export type PlatformGrowthInsightDto = {
  institutions?: { total?: number; dataPoints?: number[] | null } | null;
  users?: { total?: number; dataPoints?: number[] | null } | null;
  modules?: { total?: number; dataPoints?: number[] | null } | null;
  averageProfit?: { total?: number; dataPoints?: number[] | null } | null;
};

export type PlatformUsageInsightDto = {
  storedVideoSeconds?: number;
  deliveredVideoSeconds?: number;
  pdfStorageBytes?: number;
  pdfDownloads?: number;
  estimatedMonthlyRevenueZar?: number;
  estimatedMonthlyCostZar?: number;
};

export type PlatformPeakHoursInsightDto = {
  peakUsageHours?: Array<{ hour?: number; count?: number }> | null;
  loginEvents?: number;
  sessionEvents?: number;
  contentPeakHours?: Array<{ hour?: number; count?: number }> | null;
};

export type PlatformHealthInsightDto = {
  institutionHealth?: Array<{
    institutionId?: string;
    name?: string | null;
    lastActiveAt?: string | null;
    totalUsers?: number;
    activeUsersLast30Days?: number;
    activeUserPercent?: number;
    neverActivated?: boolean;
  }> | null;
};

export type PlatformInstitutionsInsightDto = {
  mostActiveInstitutions?: {
    labels?: string[] | null;
    series?: Array<{ id?: string; label?: string; data?: number[] | null }> | null;
  } | null;
};

export type PlatformProfitInsightDto = {
  profitMarginPerformance?: Array<{ label?: string | null; data?: number[] | null }> | null;
  profitMarginMonths?: string[] | null;
  profitMarginTrends?: { average?: number; color?: string | null } | null;
};

export type ContentActivityEventType =
  | 'ModuleSubmit'
  | 'NoteCreate'
  | 'PdfOpen'
  | 'VideoPlay';

export type DashboardInsightRole = 'admin' | 'instructor' | 'trainee' | 'platform';

export type AdminInsightId =
  | 'presence'
  | 'content'
  | 'engagement'
  | 'subjects'
  | 'grades'
  | 'followUps'
  | 'modules';

export type InstructorInsightId =
  | 'workload'
  | 'atRisk'
  | 'unassigned'
  | 'heavyLoad';

export type TraineeInsightId =
  | 'progress'
  | 'activity'
  | 'workload'
  | 'nextDue'
  | 'nextExam';

export type PlatformInsightId =
  | 'growth'
  | 'peakHours'
  | 'health'
  | 'usage'
  | 'institutions'
  | 'profit';
