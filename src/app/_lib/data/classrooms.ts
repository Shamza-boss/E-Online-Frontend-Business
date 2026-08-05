import 'server-only';

import { cache } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import type { ClassDto, ClassroomDetailsDto } from '../interfaces/types';
import { serverFetch } from '../serverFetch.server';
import { CACHE_TAGS } from './tags';

export const getAllUserClassrooms = cache(
  async (): Promise<ClassroomDetailsDto[]> => {
    const session = await auth();
    if (!session?.user?.id) redirect('/signin');

    return serverFetch<ClassroomDetailsDto[]>(
      `/classrooms/user/${session.user.id}`,
      { tags: [CACHE_TAGS.classrooms] },
    );
  },
);

export const getClassroomById = cache(
  async (classroomId: string): Promise<ClassDto> => {
    return serverFetch<ClassDto>(`/classrooms/${classroomId}`, {
      tags: [CACHE_TAGS.classrooms],
    });
  },
);
