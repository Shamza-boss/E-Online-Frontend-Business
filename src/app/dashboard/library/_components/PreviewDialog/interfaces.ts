import type { FileDto, LibraryFileDto } from '@/app/_lib/interfaces/types';

export interface PreviewDialogProps {
  file: FileDto | null;
  onClose: () => void;
  onOpenFullReader?: (file: LibraryFileDto) => void;
}
