/**
 * Client-safe classroom actions
 * 
 * These wrappers use clientFetch instead of serverFetch,
 * making them safe to call from client components via SWR or useEffect.
 */

import { clientFetch } from '../services/clientFetch';
import {
  ClassDto,
  ClassroomDetailsDto,
  UserDto,
  EnrollStudentsDto,
} from '../interfaces/types';
import { PaginationParams, PagedResult } from '../interfaces/pagination';

export async function getAllClassroomsAndDataClient(): Promise<
  ClassroomDetailsDto[]
> {
  return clientFetch('/classrooms/details');
}

export async function getAllUserClassroomsClient(): Promise<ClassroomDetailsDto[]> {
  return clientFetch('/classrooms/user/me');
}

export async function getClassroomByIdClient(classroomId: string): Promise<ClassDto> {
  return clientFetch(`/classrooms/${classroomId}`);
}

export async function getAllUsersInClassroomClient(
  classId: string
): Promise<UserDto[]> {
  return clientFetch(`/classrooms/classUsers/${classId}`);
}

export async function enrollStudentsClient(payload: EnrollStudentsDto): Promise<void> {
  return clientFetch('/classrooms/enroll', {
    method: 'POST',
    body: payload,
  });
}
