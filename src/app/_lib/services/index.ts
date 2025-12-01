/**
 * Services barrel export
 *
 * Import services with cleaner paths:
 * import { fetchPaginatedResource, uploadTextbook } from '@/services';
 */

export { fetchPaginatedResource, DEFAULT_PAGE_SIZE } from './paginationService';

export { uploadTextbook, uploadPdfAsset } from './storageUpload';
