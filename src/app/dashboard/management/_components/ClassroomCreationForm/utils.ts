import type { ClassDto, FileDto } from '@/app/_lib/interfaces/types';
import type { TextbookSelection } from '@/app/_lib/utils/textbook';

export function textbookFromClassroom(
  classroom: ClassDto | null | undefined,
): TextbookSelection | null {
  if (!classroom?.textbookKey) {
    return null;
  }

  return {
    key: classroom.textbookKey,
    hash: classroom.textbookHash,
    url: classroom.textbookUrl,
    fileName: classroom.textbookFileName ?? undefined,
    fileSizeBytes: classroom.textbookFileSizeBytes ?? undefined,
    previewImageKey: classroom.textbookPreviewImageKey ?? undefined,
    uploadedAt: classroom.textbookUploadedAt ?? undefined,
    uploadedByUserId: classroom.textbookUploadedByUserId ?? undefined,
  };
}

type AssetUploadResult = {
  key: string;
  hash: string;
  proxyDownload: string;
  name: string;
  size: number;
};

export function buildEffectiveTextbook(
  textbookAsset: AssetUploadResult | null,
  existingTextbook: TextbookSelection | null,
): TextbookSelection | null {
  if (textbookAsset) {
    return {
      key: textbookAsset.key,
      hash: textbookAsset.hash,
      url: textbookAsset.proxyDownload,
      fileName: textbookAsset.name,
      fileSizeBytes: textbookAsset.size,
      uploadedAt: new Date().toISOString(),
    };
  }

  return existingTextbook;
}

export function buildPreviewFile(
  effectiveTextbook: TextbookSelection | null,
  selectedLibraryFileId: string | null,
  textbookAssetKey: string | undefined,
): FileDto | null {
  if (!effectiveTextbook) {
    return null;
  }

  return {
    id: selectedLibraryFileId ?? textbookAssetKey ?? 'textbook',
    fileKey: effectiveTextbook.key ?? '',
    url: effectiveTextbook.url ?? '',
    hash: effectiveTextbook.hash ?? '',
    isPublic: false,
    institutionId: '',
    fileName: effectiveTextbook.fileName,
    fileSizeBytes: effectiveTextbook.fileSizeBytes,
    previewImageUrl: effectiveTextbook.previewImageUrl,
  };
}

export function getSubmitButtonLabel(isEditMode: boolean): string {
  return isEditMode ? 'Update course' : 'Create course';
}
