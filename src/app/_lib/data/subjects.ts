import 'server-only';

import { cache } from 'react';
import type { SubjectDto } from '../interfaces/types';
import { serverFetch } from '../serverFetch.server';
import { CACHE_TAGS } from './tags';

export const getAllSubjects = cache(async (): Promise<SubjectDto[]> => {
  return serverFetch<SubjectDto[]>('/subjects', {
    method: 'GET',
    tags: [CACHE_TAGS.subjects],
    revalidate: 300,
  });
});
