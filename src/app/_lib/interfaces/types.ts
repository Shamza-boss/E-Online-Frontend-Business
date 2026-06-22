import { UserRole } from '../Enums/UserRole';

export type SubscriptionPlan = 'Standard' | 'Enterprise';

export enum SubscriptionFeatureFlag {
  None = 0,
  Standard = 1,
  Enterprise = 2,
  Creator = 4,
}

export interface InstitutionSubscriptionPayload {
  plan: SubscriptionFeatureFlag;
  creatorEnabled: boolean;
}

export interface BillingRateDto {
  creatorEnabled: boolean;
}

export interface SubscriptionInfoDto {
  subscription: string;
  activeUsers: number;
  allowedUsers: number;
  overageUsers: number;
}

export interface BillingSummaryDto {
  institutionName: string;
  year: number;
  month: number;
  userCount: number;
  creatorEnabled: boolean;
  ratePerUserZar: number;
  creatorAddonPerUserZar: number;
  totalPrice: number;
}

export interface BillingUsageSummary {
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

export interface BillingCostSummary {
  cloudflareStoredUsd: number;
  cloudflareDeliveredUsd: number;
  railwayCpuUsd: number;
  railwayMemoryUsd: number;
  railwayVolumeUsd: number;
  railwayEgressUsd: number;
  railwayObjectStorageUsd: number;
  totalUsd: number;
}

export interface BillingProjectionDto {
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

export interface InvoiceLineItemDto {
  id: string;
  description: string;
  quantity: number;
  unitPriceZar: number;
  totalZar: number;
  lineType: InvoiceLineType;
}

export interface InvoiceDto {
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

export interface SendInvoiceDto {
  recipientEmail?: string;
}

export interface MarkInvoicePaidDto {
  paymentReference?: string;
  notes?: string;
}

export interface InvoiceSummaryDto {
  totalInvoices: number;
  paidCount: number;
  unpaidCount: number;
  overdueCount: number;
  totalBilledZar: number;
  totalPaidZar: number;
  totalOutstandingZar: number;
}

export interface InvoiceStatusSummaryDto {
  institutionId: string;
  institutionName: string;
  currentMonthInvoiced: boolean;
  currentMonthStatus: InvoiceStatus | null;
  lastInvoiceDate: string | null;
  lastPaymentDate: string | null;
  overdueCount: number;
}

//Homework
export interface VideoMeta {
  provider: string;
  uid: string;
  playbackId?: string;
  status: string;
  posterUrl?: string;
  durationSeconds?: number;
  sizeBytes?: number;
}

export interface PdfMeta {
  provider: string;
  key: string;
  url: string;
  hash?: string | null;
  sizeBytes?: number | null;
  title?: string | null;
}

export interface FileDto {
  id: string;
  fileKey: string;
  url: string;
  hash: string;
  isPublic: boolean;
  institutionId: string;
  thumbnail?: string | null;
  fileName?: string | null;
  /** @deprecated prefer fileSizeBytes — kept for backward compatibility */
  sizeBytes?: number | null;
  fileSizeBytes?: number | null;
  previewImageKey?: string | null;
  previewImageUrl?: string | null;
  uploadedAt?: string | null;
  uploadedByUserId?: string | null;
}

export interface VideoUploadResponse {
  uploadURL: string;
  uid: string;
  posterProbeUrl?: string;
}

export interface VideoMetaResponse {
  status: string;
  posterUrl?: string;
  durationSeconds?: number;
  playbackId?: string;
}

export interface CreateUploadDto {
  filename?: string;
  size?: number;
}

export interface Question {
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

export interface UploadResult {
  key: string;
  proxyDownload: string; // your own `/api/storage/download/...` link
  presignedGet: string; // the R2 presigned GET URL
  hash: string; // client-computed SHA-256
}

export interface Homework {
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

export interface HomeworkSummaryDto {
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

export interface HomeworkAssignmentDto {
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

export interface SubmitHomeworkDto {
  assignmentId: string; // This is crucial for linking the submission to the specific assignment
  submittedAt: string; // ISO timestamp of when the student submitted
  answers: { [questionId: string]: any }; // Map of question IDs to submitted answers
}

export interface SubmittedHomework {
  homework: Homework;
  answers: { [questionId: string]: any };
}

export interface GradeHomeworkDto {
  assignmentId: string;
  answers: { [questionId: string]: any };
  grading: { [questionId: string]: { grade: number; comment: string } };
  overallComment?: string;
  gradePublishDate: string;
}

export interface GradedHomework {
  homework: Homework;
  answers: { [questionId: string]: any };
  grading: { [questionId: string]: { grade: number; comment: string } };
  overallComment?: string;
}

//Academic Level
export interface AcademicLevelDto {
  id?: string;
  name: string;
  country: string;
  educationSystem: string;
  institutionId?: string;
}

export interface ClassDto {
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

export interface ClassroomDetailsDto {
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

export interface UpdateClassroomDto {
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

export interface EnrollStudentsDto {
  classroomId: string;
  studentIds: string[];
}

export interface NoteDto {
  id: string;
  title: string;
  content: string;
  noteDate?: string | null;
  createdAt: string;
  updatedAt?: string;
  classroomId: string;
  userId: string;
}

export interface SubjectDto {
  id?: string;
  name: string;
  group: string;
  subjectCode: string;
  category: string;
}

export interface UserDto {
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
}

export interface AssignmentDetailsDto {
  assignmentId: string;
  status: 'pending' | 'submitted' | 'graded';
  homework: Homework;
  answers: { [questionId: string]: any };
  grading?: { [questionId: string]: { grade: number; comment: string } };
  overallComment?: string;
}

export interface GradeDetailDto {
  grade: number | null; // update if you're pulling raw backend shape
  comment: string;
}

export interface InstitutionAdminDto extends NewAdminDto {
  userId?: string;
  institutionId?: string;
  role?: UserRole | null;
  status?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface InstitutionWithAdminDto {
  institution: InstitutionDto;
  admin: InstitutionAdminDto | null;
}

export interface InstitutionDto {
  id: string;
  name: string;
  adminEmail?: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  isActive: boolean;
  plan: SubscriptionFeatureFlag;
  creatorEnabled: boolean;
  billingStatus?: string | null;
  lastPaymentDate?: string | null;
  nextInvoiceDate?: string | null;
  currentInvoiceTotal?: number | null;
}

export interface NewAdminDto {
  firstName: string;
  lastName: string;
  email: string;
}

export interface HourlyLoginStat {
  hour: number; // 0–23
  count: number; // login count
}

export interface TrendMetricDto {
  total: number;
  trend: string;
  dataPoints: number[];
}

export interface SystemAdminDashboardDto {
  totalInstitutions: number;
  activeInstitutions: number;
  totalUsers: number;
  teachers: number;
  students: number;
  notesCreated: number;
  homeworkCreated: number;
  totalClassrooms: number;
  peakUsageHours: HourlyLoginStat[]; // may be empty if untracked
}

// Platform Owner Dashboard DTOs
export interface PlatformOwnerDashboardDto {
  // Sparkline trend cards (30 daily data points, same shape as InstitutionTrendsDashboardDto)
  institutions: TrendMetricDto;
  users: TrendMetricDto;
  modules: TrendMetricDto;
  totalCost: TrendMetricDto;
  averageProfit: TrendMetricDto;

  // Top 3 most active institutions (same series format as MostActiveClassSubjectSeriesDto)
  mostActiveInstitutions: MostActiveInstitutionSeriesDto;

  // Profit margin buckets (same format as gradePerformance: 6-month bars)
  profitMarginPerformance: GradePerfomanceDto[];
  profitMarginMonths: string[];
  profitMarginTrends: GradePerformanceLableTrendDto;
}

export interface MostActiveInstitutionSeriesDto {
  labels: string[];
  series: InstitutionActivitySeries[];
}

export interface InstitutionActivitySeries {
  id: string;
  label: string;
  data: number[];
}

export interface InstitutionBillingDashboardDto {
  institutionId: string;
  institutionName: string;
  userCount: number;
  ratePerUserZar: number;
  monthlyRevenueZar: number;
  usageMetrics: BillingUsageMetricsDto;
  totalCostZar: number;
  costPerUserZar: number;
  projectedMonthlyCostZar: number;
  profitZar: number;
  profitMarginPercent: number;
}

export interface BillingUsageMetricsDto {
  storedVideoMinutes: number;
  deliveredVideoMinutes: number;
  pdfStorageGb: number;
  pdfDownloads: number;
  cpuSeconds: number;
  memoryGbSeconds: number;
  egressGb: number;
  cloudflareCostUsd: number;
  railwayCostUsd: number;
  totalCostUsd: number;
}

export interface EngagementStatDto {
  submissionRate: number; // e.g., 0.91 → 91%
  avgNotePerStudent: number;
  avgHomeworkAssigned: number;
}

export interface GradePerfomanceDto {
  label: string;
  data: number[];
}

export interface GradePerformanceLableTrendDto {
  average: number;
  color: 'success' | 'error' | 'default';
}

export interface SubjectSeries {
  id: string;
  label: string;
  data: number[];
}

export interface MostActiveClassSubjectSeriesDto {
  labels: string[];
  series: SubjectSeries[];
}

export interface RecentHomeworkStatDto {
  classroomName: string;
  subjectCode: string;
  homeworkTitle: string;
  dueDate: string; // ISO date string
  studentsAssigned: number;
  submissions: number;
  submissionRate: number; // e.g., 0.85 → 85%
  averageGrade: number; // null if not graded yet
}

export interface InstitutionTrendsDashboardDto {
  id: string;
  teachers: TrendMetricDto;
  students: TrendMetricDto;
  notesCreated: TrendMetricDto;
  homeworkCreated: TrendMetricDto;
  gradePerformance: GradePerfomanceDto[];
  gradePerformanceMonths: string[]; // e.g., ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
  gradePerformanceTrends: GradePerformanceLableTrendDto;
  mostActiveSubjects: MostActiveClassSubjectSeriesDto;
  recentHomeworkStats: RecentHomeworkStatDto[];
}

// Settings / Profile insights
export interface SettingsResponseDto {
  user: SettingsUserDto;
  stats: SettingsStatsDto;
}

export interface SettingsUserDto {
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

export interface SettingsStatsDto {
  explanation: string;
  rating?: string | null;
  kpis: Record<string, number>;
  graphs: StatsGraphDto[];
  extra: Record<string, unknown>;
}

export interface StatsGraphDto {
  id: string;
  title: string;
  x: string[];
  series: StatsGraphSeriesDto[];
  description?: string | null;
}

export interface StatsGraphSeriesDto {
  name: string;
  values: number[];
}
