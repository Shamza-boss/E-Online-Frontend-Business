/**
 * Config barrel export
 *
 * import { swrConfig } from '@/config';
 */

export { swrConfig } from './swr';
export type { SWRState } from './swr';
export { swrKeys } from './swrKeys';

export {
  clientFetch,
  swrFetcher,
  proxyFetcher,
  createProxyFetcher,
} from '../services/clientFetch';
