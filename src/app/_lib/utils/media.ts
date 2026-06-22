import { FileDto, PdfMeta, VideoLibraryItem, VideoMeta } from '../interfaces/types';
import { extractTextbookName, getFileSizeBytes } from './textbook';

export function fileDtoToPdfMeta(file: FileDto): PdfMeta {
  return {
    provider: 'r2',
    key: file.fileKey,
    url: file.url,
    hash: file.hash,
    sizeBytes: getFileSizeBytes(file) ?? null,
    title: extractTextbookName(file),
  };
}

export function videoLibraryItemToVideoMeta(item: VideoLibraryItem): VideoMeta {
  return {
    provider: item.provider,
    uid: item.uid,
    playbackId: item.playbackId ?? undefined,
    status: item.status,
    posterUrl: item.posterUrl ?? undefined,
    durationSeconds: item.durationSeconds ?? undefined,
    sizeBytes: item.sizeBytes ?? undefined,
  };
}

export function formatVideoDuration(seconds?: number | null): string | null {
  if (seconds == null || seconds <= 0) return null;
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export function extractVideoTitle(item: VideoLibraryItem): string {
  if (item.title?.trim()) return item.title.trim();
  const shortUid = item.uid.length > 8 ? `${item.uid.slice(0, 8)}…` : item.uid;
  return `Video ${shortUid}`;
}
