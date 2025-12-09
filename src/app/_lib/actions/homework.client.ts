/**
 * Client-safe homework actions
 * 
 * These wrappers use clientFetch instead of serverFetch,
 * making them safe to call from client components via SWR or useEffect.
 */

import { clientFetch } from '../services/clientFetch';
import {
  HomeworkAssignmentDto,
  AssignmentDetailsDto,
  GradeHomeworkDto,
  SubmitHomeworkDto,
} from '../interfaces/types';

export async function getStudentAssignmentsClient(
  studentId: string
): Promise<HomeworkAssignmentDto[]> {
  return clientFetch(`/homework/student/${studentId}/assignments`);
}

export async function getAssignmentByIdClient(
  assignmentId: string
): Promise<AssignmentDetailsDto> {
  return clientFetch(`/homework/assignment/${encodeURIComponent(assignmentId)}`);
}

export async function getHomeworkByClassroomClient(
  classroomId: string
): Promise<HomeworkAssignmentDto[]> {
  return clientFetch(`/homework/classroom/${encodeURIComponent(classroomId)}`);
}

export async function submitHomeworkClient(submission: SubmitHomeworkDto) {
  return clientFetch('/homework/submit', {
    method: 'POST',
    body: submission,
  });
}

export async function gradeHomeworkClient(grading: GradeHomeworkDto) {
  return clientFetch('/homework/grade', {
    method: 'POST',
    body: grading,
  });
}
