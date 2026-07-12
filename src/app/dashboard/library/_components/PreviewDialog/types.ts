import type { FileDto, LibraryFileDto } from '@/app/_lib/interfaces/types';

export type PreviewDialogProps = {
  file: FileDto | null;
  onClose: () => void;
  onOpenFullReader?: (file: LibraryFileDto) => void;
}
