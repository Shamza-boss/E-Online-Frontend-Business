'use client';

import useSWR from 'swr';
import { useCallback, useMemo } from 'react';
import { VideoLibraryItem } from '@/app/_lib/interfaces/types';
import {
  getInstitutionVideos,
  type InstitutionVideosParams,
} from '@/app/_lib/actions/stream';
import { PagedResult } from '@/app/_lib/interfaces/pagination';

export interface UseInstitutionVideosParams extends InstitutionVideosParams {
  enabled?: boolean;
}

export const useInstitutionVideos = (params: UseInstitutionVideosParams = {}) => {
  const {
    enabled = true,
    searchTerm,
    pageNumber = 1,
    pageSize = 50,
  } = params;

  const swrKey = useMemo(
    () =>
      enabled
        ? ['institution-videos', pageNumber, pageSize, searchTerm ?? '']
        : null,
    [enabled, pageNumber, pageSize, searchTerm]
  );

  const fetcher = useCallback(
    () =>
      getInstitutionVideos({
        pageNumber,
        pageSize,
        searchTerm,
      }),
    [pageNumber, pageSize, searchTerm]
  );

  const { data, isLoading, isValidating, mutate } = useSWR<PagedResult<VideoLibraryItem>>(
    swrKey,
    fetcher,
    { revalidateOnMount: true }
  );

  return {
    result: data,
    videos: data?.items ?? [],
    totalCount: data?.totalCount ?? 0,
    isFetching: isLoading || isValidating,
    mutate,
  };
};
