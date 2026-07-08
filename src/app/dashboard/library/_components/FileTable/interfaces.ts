import type { FileDto } from '@/app/_lib/interfaces/types';

export interface FileTableProps {
  files: FileDto[];
  togglingId: string | null;
  onToggleVisibility: (file: FileDto) => void;
  onPreview: (file: FileDto) => void;
}
