/** Lean role-home dashboard payloads (until OpenAPI regen includes them). */

export type AtRiskTraineeDto = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  reason: string;
  lastSeenAt?: string | null;
};

export type UnassignedStudentDto = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  lastSeenAt?: string | null;
};

export type HeavyLoadStudentDto = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  peakDueCount: number;
  classCount: number;
  peakWindowStart?: string | null;
  peakWindowEnd?: string | null;
  reason: string;
};

/** Draft | ExpiredDraft | ScheduledExam | ExpiringSoon */
export type TeacherModuleActionStatus =
  | 'Draft'
  | 'ExpiredDraft'
  | 'ScheduledExam'
  | 'ExpiringSoon';

export type TeacherModuleActionDto = {
  homeworkId: string;
  title: string;
  classroomId?: string | null;
  classroomName?: string | null;
  status: TeacherModuleActionStatus | string;
  relevantAt?: string | null;
  isExam?: boolean;
};

export type InstructorHomeDashboardDto = {
  draftCount: number;
  expiredDraftCount: number;
  scheduledExamCount: number;
  expiringSoonCount: number;
  mySubmissionRate: number;
  activeTraineesLast7Days: number;
  unassignedStudentCount: number;
  heavyLoadStudentCount: number;
  actionItems: TeacherModuleActionDto[];
  atRiskTrainees: AtRiskTraineeDto[];
  unassignedStudents: UnassignedStudentDto[];
  heavyLoadStudents: HeavyLoadStudentDto[];
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
