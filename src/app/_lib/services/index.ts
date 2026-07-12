/**
 * Services barrel export
 *
 * import { fetchPaginatedResource, clientFetch } from '@/services';
 */

export { fetchPaginatedResource, DEFAULT_PAGE_SIZE } from './paginationService';

export { uploadTextbook, uploadPdfAsset } from './storageUpload';

export {
  clientFetch,
  swrFetcher,
  proxyFetcher,
  createProxyFetcher,
} from './clientFetch';
