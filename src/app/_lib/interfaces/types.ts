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
  type: 'video' | 'radio' | 'multi-select';
  options?: string[];
  required: boolean;
  weight: number; // Each question must have a weight.
  video?: VideoMeta; // Video metadata for video type questions
  subquestions?: Question[]; // Optional subquestions for nested question structure.
}

export interface UploadResult {
  key: string;
  proxyDownload: string; // your own `/api/storage/download/...` link
  presignedGet: string; // the R2 presigned GET URL
  hash: string; // client-computed SHA-256
}

export interface Homework {
  title: string;
  description: string;
  publishDate: string; // ISO date string
  dueDate: string; // ISO date string
  questions: Question[];
}

export interface HomeworkAssignmentDto {
  assignmentId: string;
  homeworkId: string;
  homeworkTitle: string;
  dueDate: string; // ISO string format
  isSubmitted: boolean;
  submittedAt: string | null;
  totalScore: number;
  isGraded: boolean;
  overallComment: string;
  classroomId: string;
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
  teacherId: string;
  teacherFirstName: string;
  teacherLastName: string;
  academicLevelName: string;
  subjectName: string;
  subjectCode: string;
  numberOfUsers: number;
  textbookUrl: string;
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

export interface InstitutionWithAdminDto {
  institution: InstitutionDto;
  admin: NewAdminDto;
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
