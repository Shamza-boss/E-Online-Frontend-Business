import { FileDto } from '../interfaces/types';

export interface TextbookSelection {
  key: string;
  hash: string;
  url: string;
  fileName?: string;
  fileSizeBytes?: number;
  previewImageKey?: string;
  previewImageUrl?: string;
  uploadedAt?: string;
  uploadedByUserId?: string;
}

export function getFileSizeBytes(file: FileDto): number | undefined {
  const size = file.fileSizeBytes ?? file.sizeBytes;
  return size != null ? Number(size) : undefined;
}

export function fileDtoToTextbookSelection(file: FileDto): TextbookSelection {
  return {
    key: file.fileKey,
    hash: file.hash,
    url: file.url,
    fileName: file.fileName ?? undefined,
    fileSizeBytes: getFileSizeBytes(file),
    previewImageKey: file.previewImageKey ?? undefined,
    previewImageUrl: file.previewImageUrl ?? undefined,
    uploadedAt: file.uploadedAt ?? undefined,
    uploadedByUserId: file.uploadedByUserId ?? undefined,
  };
}

export function formatTextbookFileSize(bytes: number): string {
  if (!bytes) return '0 KB';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function extractTextbookName(file: FileDto): string {
  if (file.fileName) return file.fileName;
  return file.fileKey.split('_').pop() ?? file.fileKey;
}
