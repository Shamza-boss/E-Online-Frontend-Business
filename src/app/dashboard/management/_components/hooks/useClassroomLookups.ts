'use client';

import { useMemo, useCallback } from 'react';
import useSWR from 'swr';
import { getAllSubjects } from '@/app/_lib/actions/subjects';
import { getAllAcademics } from '@/app/_lib/actions/academics';
import { getUsers } from '@/app/_lib/actions/users';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import type {
  AcademicLevelDto,
  SubjectDto,
  UserDto,
} from '@/app/_lib/interfaces/types';
import type { PagedResult } from '@/app/_lib/interfaces/pagination';

interface ClassroomLookups {
  subjectOptions: SubjectDto[];
  subjectsLoading: boolean;
  upsertSubject: (subject: SubjectDto) => void;
  revalidateSubjects: () => Promise<SubjectDto[] | undefined>;
  academicOptions: AcademicLevelDto[];
  academicsLoading: boolean;
  upsertAcademic: (level: AcademicLevelDto) => void;
  revalidateAcademics: () => Promise<AcademicLevelDto[] | undefined>;
  instructors: UserDto[];
  usersLoading: boolean;
}

export function useClassroomLookups(): ClassroomLookups {
  const {
    data: subjectData,
    isLoading: subjectsLoading,
    mutate: mutateSubjects,
  } = useSWR<SubjectDto[]>('subjects', getAllSubjects);

  const {
    data: academicData,
    isLoading: academicsLoading,
    mutate: mutateAcademics,
  } = useSWR<AcademicLevelDto[]>('academics', getAllAcademics);

  const { data: usersData, isLoading: usersLoading } = useSWR<
    PagedResult<UserDto>
  >('users-instructors', () =>
    getUsers({
      pageNumber: 1,
      pageSize: 100,
      sortBy: 'lastName',
      sortDirection: 'asc',
    })
  );

  const instructors = useMemo(
    () => usersData?.items?.filter((u) => u.role === UserRole.Instructor) ?? [],
    [usersData]
  );

  const upsertSubject = useCallback(
    (subject: SubjectDto) => {
      if (!subject?.id) return;
      mutateSubjects((current) => {
        if (!current) return [subject];
        const exists = current.some((entry) => entry.id === subject.id);
        if (exists) {
          return current.map((entry) =>
            entry.id === subject.id ? { ...entry, ...subject } : entry
          );
        }
        return [...current, subject];
      }, false);
    },
    [mutateSubjects]
  );

  const upsertAcademic = useCallback(
    (level: AcademicLevelDto) => {
      if (!level?.id) return;
      mutateAcademics((current) => {
        if (!current) return [level];
        const exists = current.some((entry) => entry.id === level.id);
        if (exists) {
          return current.map((entry) =>
            entry.id === level.id ? { ...entry, ...level } : entry
          );
        }
        return [...current, level];
      }, false);
    },
    [mutateAcademics]
  );

  const revalidateSubjects = useCallback(
    () => mutateSubjects(),
    [mutateSubjects]
  );
  const revalidateAcademics = useCallback(
    () => mutateAcademics(),
    [mutateAcademics]
  );

  return {
    subjectOptions: subjectData ?? [],
    subjectsLoading,
    upsertSubject,
    revalidateSubjects,
    academicOptions: academicData ?? [],
    academicsLoading,
    upsertAcademic,
    revalidateAcademics,
    instructors,
    usersLoading,
  };
}
