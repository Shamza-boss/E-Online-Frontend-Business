/**
 * Hooks barrel export
 *
 * Import hooks with cleaner paths:
 * import { useAssetUpload, useSystemDashboard, useErrorHandler } from '@/hooks';
 */

export { useAssetUpload } from './useAssetUpload';
export type {
  AssetUploadController,
  AssetUploadMetadata,
  UploadStage,
  UseAssetUploadOptions,
} from './useAssetUpload';

export { default as useAuthActions } from './useAuthActions';
export { useSystemDashboard, useInstitutionDashboard } from './useDashboard';
export { useErrorHandler } from './useErrorHandler';
export { useNavigationLoading } from './useNavigationLoading';
export { useClassroomNote, useClassroomNotesForTeacher } from './useNotes';
export { default as useResizeSync } from './useResizeSync';
export {
  useInstitutionBilling,
  useInstitutionBillingHistory,
  useInstitutionRates,
} from './useSubscriptions';
export { useCreatorAccess } from './useCreatorAccess';
