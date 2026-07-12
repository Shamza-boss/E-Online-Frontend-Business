'use server';
import { revalidatePath, updateTag } from 'next/cache';
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
import {
  getAllUserClassrooms as getAllUserClassroomsCached,
  getClassroomById as getClassroomByIdCached,
} from '../data/classrooms';
import { CACHE_TAGS } from '../data/tags';

function revalidateClassroomCaches(): void {
  updateTag(CACHE_TAGS.classrooms);
  revalidatePath('/dashboard/manage-courses');
  revalidatePath('/dashboard/courses');
  revalidatePath('/dashboard/management');
}

export async function createClassroom(classroom: ClassDto): Promise<ClassDto> {
  const result = await serverFetch<ClassDto>('/classrooms', {
    method: 'POST',
    body: classroom,
  });
  revalidateClassroomCaches();
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

/** Client-callable read — RSC pages should import from `_lib/data` instead. */
export async function getAllUserClassrooms(): Promise<ClassroomDetailsDto[]> {
  return getAllUserClassroomsCached();
}

export async function getAllUsersInClassroom(
  classId: string
): Promise<UserDto[]> {
  return serverFetch<UserDto[]>(`/classrooms/classUsers/${classId}`);
}

/** Client-callable read — RSC pages should import from `_lib/data` instead. */
export async function getClassroomById(classroomId: string): Promise<ClassDto> {
  return getClassroomByIdCached(classroomId);
}

export async function updateClassroom(
  payload: UpdateClassroomDto,
): Promise<void> {
  await serverFetch<void>(`/classrooms/${payload.id}`, {
    method: 'PUT',
    body: {
      ...payload,
      teacherId: payload.teacherId ?? null,
    },
  });
  revalidateClassroomCaches();
}

export async function deleteClassroom(classroomId: string): Promise<void> {
  await serverFetch<void>(`/classrooms/${classroomId}`, {
    method: 'DELETE',
  });
  revalidateClassroomCaches();
}
