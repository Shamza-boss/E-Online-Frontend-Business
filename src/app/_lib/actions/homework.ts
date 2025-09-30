'use server';
import {
  AssignmentDetailsDto,
  GradeHomeworkDto,
  Homework,
  HomeworkAssignmentDto,
  SubmitHomeworkDto,
} from '../interfaces/types';
import { serverFetch } from '../serverFetch';

export async function createHomework(
  homework: Homework,
  teacherId: string,
  classroomId: string,
  isDraft = true
): Promise<Response> {
  const path =
    `/Homework/create` +
    `?teacherId=${encodeURIComponent(teacherId)}` +
    `&classroomId=${encodeURIComponent(classroomId)}` +
    `&isDraft=${encodeURIComponent(isDraft)}`;

  return serverFetch(path, {
    method: 'POST',
    body: homework,
  });
}

export async function getAssignmentById(
  assignmentId: string
): Promise<AssignmentDetailsDto> {
  return serverFetch(`/Homework/assignment/${assignmentId}`);
}

export async function getHomeworkByClassroom(
  classroomId: string
): Promise<HomeworkAssignmentDto[]> {
  return serverFetch(`/Homework/Classroom/${classroomId}`);
}

export async function getStudentAssignments(
  studentId: string
): Promise<HomeworkAssignmentDto[]> {
  return serverFetch(`/Homework/student/${studentId}/assignments`);
}

export async function gradeHomework(grading: GradeHomeworkDto) {
  return serverFetch('/Homework/Grade', {
    method: 'POST',
    body: grading,
  });
}

export async function submitHomework(submission: SubmitHomeworkDto) {
  return serverFetch('/Homework/Submit', {
    method: 'POST',
    body: submission,
  });
}
