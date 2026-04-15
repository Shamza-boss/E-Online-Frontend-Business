import type { HomeworkAssignmentDto } from '@/app/_lib/interfaces/types';

export const filterAssignmentsByClass = (
  data: HomeworkAssignmentDto[] | undefined,
  classId: string
): HomeworkAssignmentDto[] => {
  if (!data) return [];
  return data.filter((assignment) => assignment.classroomId === classId);
};

export const formatStudentTitle = (
  student: { firstName?: string; lastName?: string } | null
): string => {
  if (!student) return 'Student';
  return `${student.firstName} ${student.lastName}`.trim();
};

export const formatScore = (assignment: {
  studentScore?: number | null;
  totalScore?: number | null;
  gradeSummary?: { awarded?: number | null } | null;
}): string => {
  const score =
    assignment.studentScore ??
    assignment.totalScore ??
    assignment.gradeSummary?.awarded ??
    null;
  if (score === null || score === undefined) return '—';
  const numericScore = Number(score);
  return Number.isFinite(numericScore) ? numericScore.toFixed(1) : '—';
};
