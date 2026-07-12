import type { JsonValue } from '@/lib/api/json';
import { type UserRole } from '../Enums/UserRole';

export type SubscriptionPlan = 'Standard' | 'Enterprise';

export enum SubscriptionFeatureFlag {
  None = 0,
  Standard = 1,
  Enterprise = 2,
  Creator = 4,
}

export type InstitutionSubscriptionPayload = {
  plan: SubscriptionFeatureFlag;
  creatorEnabled: boolean;
}

export type BillingRateDto = {
  creatorEnabled: boolean;
}

export type SubscriptionInfoDto = {
  subscription: string;
  activeUsers: number;
  allowedUsers: number;
  overageUsers: number;
}

export type BillingSummaryDto = {
  institutionName: string;
  year: number;
  month: number;
  userCount: number;
  creatorEnabled: boolean;
  ratePerUserZar: number;
  creatorAddonPerUserZar: number;
  totalPrice: number;
}

export type BillingUsageSummary = {
  userCount: number;
  storedVideoMinutes: number;
  deliveredVideoMinutes: number;
  pdfStorageGb: number;
  pdfDownloads: number;
  cpuSeconds: number;
  memoryGbSeconds: number;
  volumeGbSeconds: number;
  egressGb: number;
  objectStorageGbMonthFraction: number;
}

export type BillingCostSummary = {
  cloudflareStoredUsd: number;
  cloudflareDeliveredUsd: number;
  railwayCpuUsd: number;
  railwayMemoryUsd: number;
  railwayVolumeUsd: number;
  railwayEgressUsd: number;
  railwayObjectStorageUsd: number;
  totalUsd: number;
}

export type BillingProjectionDto = {
  year: number;
  month: number;
  usage: BillingUsageSummary;
  costsUsd: BillingCostSummary;
  chargeTotal: number;
  expectedMargin: number;
}

// ── Invoice types ────────────────────────────────────────────────

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';

export type InvoiceLineType = 'BaseRate' | 'CreatorAddon';

export type InvoiceLineItemDto = {
  id: string;
  description: string;
  quantity: number;
  unitPriceZar: number;
  totalZar: number;
  lineType: InvoiceLineType;
}

export type InvoiceDto = {
  id: string;
  institutionId: string;
  institutionName: string;
  invoiceNumber: string;
  year: number;
  month: number;
  userCount: number;
  creatorEnabled: boolean;
  ratePerUserZar: number;
  creatorAddonPerUserZar: number;
  subtotalZar: number;
  creatorTotalZar: number;
  totalAmountZar: number;
  rateTier: string;
  status: InvoiceStatus;
  issuedAt: string;
  dueDate: string;
  sentAt: string | null;
  sentToEmail: string | null;
  paidAt: string | null;
  paymentReference: string | null;
  notes: string | null;
  lineItems: InvoiceLineItemDto[];
  createdAt: string;
  updatedAt: string;
}

export type SendInvoiceDto = {
  recipientEmail?: string;
}

export type MarkInvoicePaidDto = {
  paymentReference?: string;
  notes?: string;
}

export type InvoiceSummaryDto = {
  totalInvoices: number;
  paidCount: number;
  unpaidCount: number;
  overdueCount: number;
  totalBilledZar: number;
  totalPaidZar: number;
  totalOutstandingZar: number;
}

export type InvoiceStatusSummaryDto = {
  institutionId: string;
  institutionName: string;
  currentMonthInvoiced: boolean;
  currentMonthStatus: InvoiceStatus | null;
  lastInvoiceDate: string | null;
  lastPaymentDate: string | null;
  overdueCount: number;
}

//Homework
export type VideoMeta = {
  provider: string;
  uid: string;
  playbackId?: string;
  status: string;
  posterUrl?: string;
  durationSeconds?: number;
  sizeBytes?: number;
}

export type VideoLibraryItem = {
  id: string;
  uid: string;
  provider: string;
  playbackId?: string | null;
  status: string;
  posterUrl?: string | null;
  durationSeconds?: number | null;
  sizeBytes?: number | null;
  title?: string | null;
  usedInModuleCount: number;
}

export type PdfMeta = {
  provider: string;
  key: string;
  url: string;
  hash?: string | null;
  sizeBytes?: number | null;
  title?: string | null;
}

export type FileDto = {
  id: string;
  fileKey: string;
  url: string;
  hash: string;
  isPublic: boolean;
  institutionId: string;
  thumbnail?: string | null;
  fileName?: string | null;
  /** @deprecated prefer fileSizeBytes */
  sizeBytes?: number | null;
  fileSizeBytes?: number | null;
  previewImageKey?: string | null;
  previewImageUrl?: string | null;
  uploadedAt?: string | null;
  uploadedByUserId?: string | null;
}

export type LinkedClassroomDto = {
  id: string;
  name: string;
  academicLevelName?: string | null;
  academicLevelId?: string | null;
  subjectName?: string | null;
}

export type LibraryFileDto = FileDto & {
  linkedClassrooms: LinkedClassroomDto[];
  linkedClassroomCount: number;
}

export type VideoUploadResponse = {
  uploadURL: string;
  uid: string;
  posterProbeUrl?: string;
}

export type VideoMetaResponse = {
  status: string;
  posterUrl?: string;
  durationSeconds?: number;
  playbackId?: string;
}

export type CreateUploadDto = {
  filename?: string;
  size?: number;
}

export type Question = {
  id: string;
  questionText: string;
  type:
    | 'video'
    | 'pdf'
    | 'single-select'
    | 'multi-select'
    | 'placeholder'
    | 'group';
  displayOrder?: string;
  options?: string[];
  required: boolean;
  weight: number; // Each question must have a weight.
  video?: VideoMeta; // Video metadata for video type questions
  pdf?: PdfMeta; // PDF metadata for PDF type questions
  subquestions?: Question[]; // Optional subquestions for nested question structure.
  correctAnswer?: string; // For single-choice questions
  correctAnswers?: string[]; // For multi-select questions
}

export type UploadResult = {
  key: string;
  proxyDownload: string; // your own `/api/storage/download/...` link
  presignedGet: string; // the R2 presigned GET URL
  hash: string; // client-computed SHA-256
}

export type Homework = {
  id?: string;
  homeworkId?: string;
  classroomId?: string;
  title: string;
  description: string;
  dueDate: string; // ISO date string
  hasExpiry: boolean;
  expiryDate?: string | null; // ISO date string when hasExpiry is true
  isPublished?: boolean;
  isActive?: boolean;
  completions?: number;
  totalStudents?: number;
  studentScore?: number | null;
  studentTotalWeight?: number | null;
  studentPercentage?: number | null;
  isExam?: boolean;
  scheduledAt?: string | null; // ISO 8601 DateTimeOffset — when the exam becomes accessible
  allowReset?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  questions: Question[];
}

export type HomeworkPayload = Pick<
  Homework,
  | 'title'
  | 'description'
  | 'dueDate'
  | 'hasExpiry'
  | 'expiryDate'
  | 'isExam'
  | 'scheduledAt'
  | 'allowReset'
  | 'questions'
>;

export type HomeworkSummaryDto = {
  homeworkId: string;
  title: string;
  description: string;
  dueDate: string;
  hasExpiry: boolean;
  expiryDate?: string | null;
  isPublished: boolean;
  isActive: boolean;
  completions: number;
  totalStudents: number;
  classroomId?: string;
  isExam?: boolean;
  scheduledAt?: string | null;
  allowReset?: boolean;
  questions?: Question[];
}

export type HomeworkAssignmentDto = {
  assignmentId: string;
  homeworkId: string;
  homeworkTitle: string;
  homeworkDescription?: string;
  dueDate: string; // ISO string format
  isSubmitted: boolean;
  submittedAt: string | null;
  totalScore: number | null;
  totalWeight?: number | null;
  percentage?: number | null;
  studentScore?: number | null;
  studentTotalWeight?: number | null;
  studentPercentage?: number | null;
  isGraded: boolean;
  overallComment: string;
  classroomId: string;
  attemptNumber?: number;
  isExam?: boolean;
  allowReset?: boolean;
  gradeSummary?: {
    awarded: number | null;
    totalWeight: number | null;
    percentage: number | null;
  };
}

export type SubmitHomeworkDto = {
  assignmentId: string; // This is crucial for linking the submission to the specific assignment
  submittedAt: string; // ISO timestamp of when the student submitted
  answers: { [questionId: string]: JsonValue }; // Map of question IDs to submitted answers
}

export type SubmittedHomework = {
  homework: Homework;
  answers: { [questionId: string]: JsonValue };
}

export type GradeHomeworkDto = {
  assignmentId: string;
  answers: { [questionId: string]: JsonValue };
  grading: { [questionId: string]: { grade: number; comment: string } };
  overallComment?: string;
  gradePublishDate: string;
}

export type GradedHomework = {
  homework: Homework;
  answers: { [questionId: string]: JsonValue };
  grading: { [questionId: string]: { grade: number; comment: string } };
  overallComment?: string;
}

//Academic Level
export type AcademicLevelDto = {
  id?: string;
  name: string;
  country: string;
  educationSystem: string;
  institutionId?: string;
}

export type ClassDto = {
  id?: string;
  name: string;
  teacherId: string;
  academicLevelId: string;
  subjectId: string;
  textbookKey: string;
  textbookHash: string;
  textbookUrl: string;
  textbookFileName?: string | null;
  textbookFileSizeBytes?: number | null;
  textbookPreviewImageKey?: string | null;
  textbookUploadedAt?: string | null;
  textbookUploadedByUserId?: string | null;
}

export type ClassroomDetailsDto = {
  classroomId: string;
  classroomName: string;
  teacherId?: string | null;
  teacherFirstName: string;
  teacherLastName: string;
  academicLevelId?: string;
  academicLevelName: string;
  subjectId?: string;
  subjectName: string;
  subjectCode: string;
  numberOfUsers: number;
  textbookUrl: string;
}

export type UpdateClassroomDto = {
  id: string;
  name: string;
  teacherId?: string | null;
  academicLevelId: string;
  subjectId: string;
  textbookKey: string;
  textbookHash: string;
  textbookUrl?: string;
  textbookFileName?: string;
  textbookFileSizeBytes?: number;
  textbookPreviewImageKey?: string;
  textbookUploadedAt?: string;
  textbookUploadedByUserId?: string;
}

export type EnrollStudentsDto = {
  classroomId: string;
  studentIds: string[];
}

export type NoteDto = {
  id: string;
  title: string;
  content: string;
  noteDate?: string | null;
  createdAt: string;
  updatedAt?: string;
  classroomId: string;
  userId: string;
}

export type SubjectDto = {
  id?: string;
  name: string;
  group: string;
  subjectCode: string;
  category: string;
}

export type UserDto = {
  userId?: string;
  institutionId: string;
  inststitutionName?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole | null;
  subscription?: string | null;
  subscriptionLabel?: string | null;
  subscriptionPlan?: SubscriptionPlan | null;
  creatorEnabled?: boolean;
  firstLoginAt?: string | null;
  lastSeenAt?: string | null;
  loginCountLast30Days?: number;
}

export type AssignmentDetailsDto = {
  assignmentId: string;
  status: 'pending' | 'submitted' | 'graded';
  homework: Homework;
  answers: { [questionId: string]: JsonValue };
  grading?: { [questionId: string]: { grade: number; comment: string } };
  overallComment?: string;
}

export type GradeDetailDto = {
  grade: number | null; // update if you're pulling raw backend shape
  comment: string;
}

export type InstitutionAdminDto = NewAdminDto & {
  userId?: string;
  institutionId?: string;
  role?: UserRole | null;
  status?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type InstitutionWithAdminDto = {
  institution: InstitutionDto;
  admin: InstitutionAdminDto | null;
}

export type InstitutionDto = {
  id: string;
  name: string;
  adminEmail?: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  isActive: boolean;
  plan: SubscriptionFeatureFlag;
  creatorEnabled: boolean;
  lastActiveAt?: string | null;
  billingStatus?: string | null;
  lastPaymentDate?: string | null;
  nextInvoiceDate?: string | null;
  currentInvoiceTotal?: number | null;
}

export type NewAdminDto = {
  firstName: string;
  lastName: string;
  email: string;
}

// Dashboard / billing DTOs — sourced from OpenAPI (`_lib/api/schemas.ts`)
export type {
  BillingUsageMetricsDto,
  EngagementStatDto,
  GradePerfomanceDto,
  GradePerformanceDto,
  GradePerformanceLableTrendDto,
  HourlyLoginStat,
  InactiveUserSummaryDto,
  InstitutionActivitySeries,
  InstitutionBillingDashboardDto,
  InstitutionTrendDashboardDto,
  InstitutionTrendsDashboardDto,
  MostActiveClassSubjectSeriesDto,
  MostActiveInstitutionSeriesDto,
  PlatformOwnerDashboardDto,
  RecentHomeworkStatDto,
  SubjectSeries,
  SystemAdminDashboardDto,
  TrendMetricDto,
} from '../api/schemas';

// Settings / Profile insights
export type SettingsResponseDto = {
  user: SettingsUserDto;
  stats: SettingsStatsDto;
}

export type SettingsUserDto = {
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole | string | number | null;
  institutionId?: string | null;
  institutionName?: string | null;
  status?: string | null;
  emailVerifiedAt?: string | null;
  passkeyEnrolledAt?: string | null;
  firstLoginAt?: string | null;
  enrollmentCompletedAt?: string | null;
  createdAt?: string;
  createdByUserId?: string | null;
  subscription?: string | null;
  subscriptionLabel?: string | null;
  subscriptionPlan?: SubscriptionPlan | null;
  creatorEnabled?: boolean;
}

export type SettingsStatsDto = {
  explanation: string;
  rating?: string | null;
  kpis: Record<string, number>;
  graphs: StatsGraphDto[];
  extra: Record<string, JsonValue>;
}

export type StatsGraphDto = {
  id: string;
  title: string;
  x: string[];
  series: StatsGraphSeriesDto[];
  description?: string | null;
}

export type StatsGraphSeriesDto = {
  name: string;
  values: number[];
}
