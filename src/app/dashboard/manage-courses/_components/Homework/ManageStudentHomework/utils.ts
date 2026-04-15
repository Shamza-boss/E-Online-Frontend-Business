import {
  getStudentAssignments,
  gradeHomework,
} from '@/app/_lib/actions/homework';
import type {
  HomeworkAssignmentDto,
  GradedHomework,
  GradeHomeworkDto,
  AssignmentDetailsDto,
} from '@/app/_lib/interfaces/types';

export const getStatusAndTab = (
  row: any
): { status: 'graded' | 'submitted' | 'pending'; tab: number } => {
  if (row.isGraded) return { status: 'graded', tab: 2 };
  if (row.isSubmitted) return { status: 'submitted', tab: 1 };
  return { status: 'pending', tab: 0 };
};

export const buildFetchAssignments =
  (userId: string, classId: string) =>
  async (): Promise<HomeworkAssignmentDto[]> => {
    const allAssignments = await getStudentAssignments(userId);
    return allAssignments.filter((a) => a.classroomId === classId);
  };

export const submitGradedHomework = async (
  submitted: GradedHomework,
  assignmentId: string,
  mutateFn: () => Promise<unknown>,
  onComplete: () => void
): Promise<void> => {
  const gradedAssignment: GradeHomeworkDto = {
    ...submitted,
    assignmentId,
    gradePublishDate: new Date().toISOString(),
  };
  await gradeHomework(gradedAssignment);
  await mutateFn();
  onComplete();
};
