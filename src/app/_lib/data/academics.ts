import 'server-only';

import { cache } from 'react';
import type { AcademicLevelDto } from '../interfaces/types';
import { serverFetch } from '../serverFetch.server';
import { CACHE_TAGS } from './tags';

export const getAllAcademics = cache(async (): Promise<AcademicLevelDto[]> => {
  return serverFetch<AcademicLevelDto[]>('/academicLevel', {
    tags: [CACHE_TAGS.academics],
    revalidate: 300,
  });
});
