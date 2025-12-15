/**
 * Interfaces barrel export
 *
 * Import types with cleaner paths:
 * import type { UserDto, ClassDto, PagedResult } from '@/interfaces';
 */

// Pagination types
export type { PagedResult, PaginationParams } from './pagination';

// Main types - export all from types.ts
export * from './types';

// Auth types
export * from './Auth';
