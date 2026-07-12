'use server';
import { revalidatePath } from 'next/cache';
import {
  type ClassDto,
  type ClassroomDetailsDto,
  type EnrollStudentsDto,
  type UpdateClassroomDto,
  type UserDto,
} from '../interfaces/types';
import { redirect } from 'next/navigation';
import { serverFetch } from '../serverFetch.server';
import { auth } from '@/auth';
import { type PagedResult, type PaginationParams } from '../interfaces/pagination';
import { fetchPaginatedResource } from '../services/paginationService';

export async function createClassroom(classroom: ClassDto): Promise<ClassDto> {
  const result = await serverFetch<ClassDto>('/classrooms', {
    method: 'POST',
    body: classroom,
  });
  revalidatePath('/dashboard/manage-courses');
  return result;
}

export async function EnrollStudents(
  newStudents: EnrollStudentsDto,
): Promise<void> {
  const session = await auth();
  if (!session) redirect('/signin');

  return serverFetch<void>('/classrooms/EnrollStudents', {
    method: 'POST',
    body: newStudents,
  });
}

export async function UnenrollStudents(
  studentsToRemove: EnrollStudentsDto,
): Promise<void> {
  const session = await auth();
  if (!session) redirect('/signin');

  return serverFetch<void>('/classrooms/UnenrollStudents', {
    method: 'POST',
    body: studentsToRemove,
  });
}

export async function getAllClassrooms(): Promise<ClassDto[]> {
  return serverFetch<ClassDto[]>('/classrooms');
}

export async function getAllClassroomsAndData(): Promise<
  ClassroomDetailsDto[]
> {
  return serverFetch<ClassroomDetailsDto[]>('/classrooms/details');
}

export async function getClassroomsAndData(
  params?: PaginationParams
): Promise<PagedResult<ClassroomDetailsDto>> {
  return fetchPaginatedResource<ClassroomDetailsDto>(
    '/classrooms/details',
    params
  );
}

export async function getAllUserClassrooms(): Promise<ClassroomDetailsDto[]> {
  const session = await auth();
  if (!session) redirect('/signin');

  return serverFetch<ClassroomDetailsDto[]>(
    `/classrooms/user/${session?.user.id}`
  );
}

export async function getAllUsersInClassroom(
  classId: string
): Promise<UserDto[]> {
  return serverFetch<UserDto[]>(`/classrooms/classUsers/${classId}`);
}

export async function getClassroomById(classroomId: string): Promise<ClassDto> {
  return serverFetch<ClassDto>(`/classrooms/${classroomId}`);
}

export async function updateClassroom(
  payload: UpdateClassroomDto
): Promise<void> {
  return serverFetch<void>(`/classrooms/${payload.id}`, {
    method: 'PUT',
    body: {
      ...payload,
      teacherId: payload.teacherId ?? null,
    },
  });
}

export async function deleteClassroom(classroomId: string): Promise<void> {
  return serverFetch<void>(`/classrooms/${classroomId}`, {
    method: 'DELETE',
  });
}
