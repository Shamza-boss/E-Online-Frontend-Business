import { UserRole } from '../Enums/UserRole';

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
  // New fields for metadata and thumbnail
  thumbnail?: string | null; // Data URL or URL to the thumbnail image
  fileName?: string | null;
  sizeBytes?: number | null;
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
  type: 'video' | 'pdf' | 'radio' | 'multi-select';
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
  questions: Question[];
}

export type HomeworkPayload = Pick<
  Homework,
  'title' | 'description' | 'dueDate' | 'hasExpiry' | 'expiryDate' | 'questions'
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
  questions?: Question[];
}

export interface HomeworkAssignmentDto {
  assignmentId: string;
  homeworkId: string;
  homeworkTitle: string;
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
  adminEmail: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  isActive: boolean;
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
