'use server';
import {
  ClassDto,
  ClassroomDetailsDto,
  EnrollStudentsDto,
  UpdateClassroomDto,
  UserDto,
} from '../interfaces/types';
import { redirect } from 'next/navigation';
import { serverFetch } from '../serverFetch';
import { auth } from '@/auth';

export async function createClassroom(classroom: ClassDto): Promise<any> {
  return serverFetch('/classrooms', {
    method: 'POST',
    body: classroom,
  });
}

export async function EnrollStudents(
  newStudents: EnrollStudentsDto
): Promise<any> {
  const session = await auth();
  if (!session) redirect('/signin');

  return serverFetch('/classrooms/EnrollStudents', {
    method: 'POST',
    body: newStudents,
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
