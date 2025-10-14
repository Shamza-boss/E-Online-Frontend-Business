'use server';
import {
  AssignmentDetailsDto,
  GradeHomeworkDto,
  HomeworkAssignmentDto,
  HomeworkPayload,
  HomeworkSummaryDto,
  SubmitHomeworkDto,
  Homework,
} from '../interfaces/types';
import { serverFetch } from '../serverFetch';

export async function createHomework(
  homework: HomeworkPayload,
  teacherId: string,
  classroomId: string,
  isDraft = true
): Promise<Response> {
  const path =
    `/homework/create` +
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
  return serverFetch(`/homework/assignment/${assignmentId}`);
}

export async function getHomeworkByClassroom(
  classroomId: string
): Promise<HomeworkAssignmentDto[]> {
  return serverFetch(`/homework/classroom/${encodeURIComponent(classroomId)}`);
}

export async function getStudentAssignments(
  studentId: string
): Promise<HomeworkAssignmentDto[]> {
  return serverFetch(`/homework/student/${studentId}/assignments`);
}

export async function gradeHomework(grading: GradeHomeworkDto) {
  return serverFetch('/homework/grade', {
    method: 'POST',
    body: grading,
  });
}

export async function submitHomework(submission: SubmitHomeworkDto) {
  return serverFetch('/homework/submit', {
    method: 'POST',
    body: submission,
  });
}

export async function getHomeworkForTeacher(
  teacherId: string,
  homeworkId: string
): Promise<Homework> {
  return serverFetch(
    `/homework/teacher/${encodeURIComponent(teacherId)}/module/${encodeURIComponent(homeworkId)}`
  );
}

export async function updateHomeworkDraft(
  teacherId: string,
  homeworkId: string,
  payload: HomeworkPayload
) {
  return serverFetch(
    `/homework/teacher/${encodeURIComponent(teacherId)}/module/${encodeURIComponent(homeworkId)}`,
    {
      method: 'PUT',
      body: payload,
    }
  );
}

export async function publishHomework(teacherId: string, homeworkId: string) {
  return serverFetch(
    `/homework/teacher/${encodeURIComponent(teacherId)}/module/${encodeURIComponent(homeworkId)}/publish`,
    {
      method: 'POST',
    }
  );
}

export async function unpublishHomework(teacherId: string, homeworkId: string) {
  return serverFetch(
    `/homework/teacher/${encodeURIComponent(teacherId)}/module/${encodeURIComponent(homeworkId)}/unpublish`,
    {
      method: 'POST',
    }
  );
}

export async function softDeleteHomework(
  teacherId: string,
  homeworkId: string
) {
  return serverFetch(
    `/homework/teacher/${encodeURIComponent(teacherId)}/module/${encodeURIComponent(homeworkId)}`,
    {
      method: 'DELETE',
    }
  );
}

export async function listTeacherHomeworks(
  teacherId: string,
  classroomId?: string
): Promise<HomeworkSummaryDto[]> {
  const basePath = `/homework/teacher/${encodeURIComponent(
    teacherId
  )}/homeworks`;
  const path = classroomId
    ? `${basePath}?classroomId=${encodeURIComponent(classroomId)}`
    : basePath;

  return serverFetch(path);
}

export async function listTeacherClassroomModules(
  teacherId: string,
  classroomId: string
): Promise<Homework[]> {
  const path = `/homework/teacher/${encodeURIComponent(teacherId)}/classroom/${encodeURIComponent(classroomId)}/homeworks`;

  const summaries = await serverFetch<HomeworkSummaryDto[]>(path);

  if (!summaries) {
    return [];
  }

  return summaries.map((summary) => ({
    ...summary,
    id: summary.homeworkId,
    homeworkId: summary.homeworkId,
    questions: summary.questions ?? [],
  }));
}

export async function getTeacherStudentAssignments(
  teacherId: string,
  studentId: string
): Promise<HomeworkAssignmentDto[]> {
  return serverFetch(
    `/homework/teacher/${encodeURIComponent(teacherId)}/student/${encodeURIComponent(studentId)}/assignments`
  );
}
