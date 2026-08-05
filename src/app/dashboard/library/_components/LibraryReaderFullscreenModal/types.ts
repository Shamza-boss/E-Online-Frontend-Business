import type { LibraryFileDto } from '@/app/_lib/interfaces/types';

export type LibraryReaderFullscreenModalProps = {
  file: LibraryFileDto | null;
  open: boolean;
  onClose: () => void;
}
