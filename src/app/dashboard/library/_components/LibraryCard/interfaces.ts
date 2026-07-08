import type { LibraryFileDto } from '@/app/_lib/interfaces/types';

export interface LibraryCardProps {
  file: LibraryFileDto;
  onRead: (file: LibraryFileDto) => void;
}
