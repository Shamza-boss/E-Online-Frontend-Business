'use server';
import {
  ClassDto,
  ClassroomDetailsDto,
  EnrollStudentsDto,
  UserDto,
} from '../interfaces/types';
import { redirect } from 'next/navigation';
import { serverFetch } from '../serverFetch';
import { auth } from '@/auth';

export async function createClassroom(classroom: ClassDto): Promise<any> {
  return serverFetch('/Classroom', {
    method: 'POST',
    body: classroom,
  });
}

export async function EnrollStudents(
  newStudents: EnrollStudentsDto
): Promise<any> {
  const session = await auth();
  if (!session) redirect('/signin');

  return serverFetch('/Classrooms/EnrollStudents', {
    method: 'POST',
    body: newStudents,
  });
}

export async function getAllClassrooms(): Promise<ClassDto[]> {
  return serverFetch<ClassDto[]>('/Classrooms');
}

export async function getAllClassroomsAndData(): Promise<
  ClassroomDetailsDto[]
> {
  return serverFetch<ClassroomDetailsDto[]>('/Classrooms/details');
}

export async function getAllUserClassrooms(): Promise<ClassroomDetailsDto[]> {
  const session = await auth();
  if (!session) redirect('/signin');

  return serverFetch<ClassroomDetailsDto[]>(
    `/Classrooms/user/${session?.user.id}`
  );
}

export async function getAllUsersInClassroom(
  classId: string
): Promise<UserDto[]> {
  return serverFetch<UserDto[]>(`/Classrooms/classUsers/${classId}`);
}

export async function getClassroomById(classroomId: string): Promise<ClassDto> {
  return serverFetch<ClassDto>(`/Classrooms/${classroomId}`);
}
