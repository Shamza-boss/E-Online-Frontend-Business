/**
 * Hooks barrel export
 *
 * Import hooks with cleaner paths:
 * import { useAssetUpload, useDashboard, useErrorHandler } from '@/hooks';
 */

export { useAssetUpload } from './useAssetUpload';
export type {
  AssetUploadController,
  AssetUploadMetadata,
  UploadStage,
  UseAssetUploadOptions,
} from './useAssetUpload';

export { useAuthActions } from './useAuthActions';
export { useDashboard } from './useDashboard';
export { useErrorHandler } from './useErrorHandler';
export { useNavigationLoading } from './useNavigationLoading';
export { useNotes } from './useNotes';
export { useResizeSync } from './useResizeSync';
