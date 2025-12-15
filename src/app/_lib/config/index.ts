/**
 * Config barrel export
 *
 * Import config with cleaner paths:
 * import { swrConfig, createFetcher } from '@/config';
 */

export {
  swrConfig,
  createFetcher,
  createCustomFetcher,
  proxyFetcher,
  createProxyFetcher,
} from './swr';

export type { SWRState } from './swr';
