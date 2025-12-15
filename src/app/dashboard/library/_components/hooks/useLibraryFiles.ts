'use client';

import useSWR from 'swr';
import { FileDto } from '@/app/_lib/interfaces/types';
import {
  getRepositoryFiles,
  toggleRepositoryFileVisibility,
} from '@/app/_lib/actions/storage';

export const useLibraryFiles = () => {
  const { data, isLoading, isValidating, mutate } = useSWR<FileDto[]>(
    'repository-files',
    getRepositoryFiles,
    { revalidateOnMount: true }
  );

  const files = data ?? [];
  const isFetching = isLoading || isValidating;

  return {
    files,
    isFetching,
    mutate,
  };
};

export const useToggleFileVisibility = () => {
  const handleToggle = async (file: FileDto) => {
    await toggleRepositoryFileVisibility(file.id);
  };

  return { handleToggle };
};
