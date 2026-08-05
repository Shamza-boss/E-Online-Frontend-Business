/** Lean role-home dashboard payloads (until OpenAPI regen includes them). */

export type AtRiskTraineeDto = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  reason: string;
  lastSeenAt?: string | null;
};

export type InstructorHomeDashboardDto = {
  pendingToGradeCount: number;
  mySubmissionRate: number;
  activeTraineesLast7Days: number;
  upcomingDueCount: number;
  atRiskTrainees: AtRiskTraineeDto[];
};

export type TraineeDueItemDto = {
  assignmentId: string;
  title: string;
  dueDate?: string | null;
  isOverdue: boolean;
  isExam: boolean;
  classroomId?: string | null;
  classroomName?: string | null;
};

export type TraineeHomeDashboardDto = {
  dueSoonCount: number;
  overdueCount: number;
  myAverageGrade: number;
  mySubmissionRate: number;
  nextDue: TraineeDueItemDto[];
  nextExamTitle?: string | null;
  nextExamScheduledAt?: string | null;
};

export type InstitutionHealthDto = {
  institutionId: string;
  name: string;
  lastActiveAt?: string | null;
  totalUsers: number;
  activeUsersLast30Days: number;
  activeUserPercent: number;
  neverActivated: boolean;
};

export type PlatformOwnerHealthFields = {
  activeInstitutionsLast7Days?: number;
  activeInstitutionsLast30Days?: number;
  neverActivatedInstitutions?: number;
  institutionHealth?: InstitutionHealthDto[];
};
