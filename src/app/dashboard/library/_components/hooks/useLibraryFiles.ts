'use client';

import useSWR from 'swr';
import { useCallback, useMemo } from 'react';
import { type FileDto, type LibraryFileDto } from '@/app/_lib/interfaces/types';
import {
  getRepositoryFiles,
  getRepositoryFilesPaged,
  toggleRepositoryFileVisibility,
  type LibraryQueryParams,
} from '@/app/_lib/actions/storage';
import { type PagedResult } from '@/app/_lib/interfaces/pagination';
import { swrKeys } from '@/app/_lib/config/swrKeys';

export const useLibraryFiles = () => {
  const { data, isLoading, isValidating, mutate } = useSWR<FileDto[]>(
    swrKeys.repositoryFiles,
    getRepositoryFiles,
    { revalidateOnMount: true },
  );

  const files = data ?? [];
  const isFetching = isLoading || isValidating;

  return {
    files,
    isFetching,
    mutate,
  };
};

export type UseLibraryFilesPagedParams = {
  enabled?: boolean;
} & LibraryQueryParams

export const useLibraryFilesPaged = (params: UseLibraryFilesPagedParams) => {
  const {
    enabled = true,
    pageNumber = 1,
    pageSize = 20,
    searchTerm,
    sortBy,
    sortDirection,
    academicLevelId,
    classroomId,
    isPublic,
    unlinkedOnly,
  } = params;

  const swrKey = useMemo(
    () =>
      enabled
        ? [
            'repository-files-paged',
            pageNumber,
            pageSize,
            searchTerm ?? '',
            sortBy ?? 'uploadedAt',
            sortDirection ?? 'desc',
            academicLevelId ?? '',
            classroomId ?? '',
            isPublic,
            unlinkedOnly ?? false,
          ]
        : null,
    [
      enabled,
      pageNumber,
      pageSize,
      searchTerm,
      sortBy,
      sortDirection,
      academicLevelId,
      classroomId,
      isPublic,
      unlinkedOnly,
    ]
  );

  const fetcher = useCallback(
    () =>
      getRepositoryFilesPaged({
        pageNumber,
        pageSize,
        searchTerm,
        sortBy,
        sortDirection,
        academicLevelId,
        classroomId,
        isPublic,
        unlinkedOnly,
      }),
    [
      pageNumber,
      pageSize,
      searchTerm,
      sortBy,
      sortDirection,
      academicLevelId,
      classroomId,
      isPublic,
      unlinkedOnly,
    ]
  );

  const { data, isLoading, isValidating, mutate } = useSWR<PagedResult<LibraryFileDto>>(
    swrKey,
    fetcher,
    { keepPreviousData: true }
  );

  return {
    result: data,
    files: data?.items ?? [],
    totalCount: data?.totalCount ?? 0,
    isFetching: isLoading || isValidating,
    mutate,
  };
};

export const useToggleFileVisibility = () => {
  const handleToggle = async (file: FileDto) => {
    await toggleRepositoryFileVisibility(file.id);
  };

  return { handleToggle };
};
