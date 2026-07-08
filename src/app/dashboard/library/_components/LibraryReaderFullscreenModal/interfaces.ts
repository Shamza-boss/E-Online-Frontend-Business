import type { LibraryFileDto } from '@/app/_lib/interfaces/types';

export interface LibraryReaderFullscreenModalProps {
  file: LibraryFileDto | null;
  open: boolean;
  onClose: () => void;
}
