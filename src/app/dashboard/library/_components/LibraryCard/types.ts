import type { LibraryFileDto } from '@/app/_lib/interfaces/types';

export type LibraryCardProps = {
  file: LibraryFileDto;
  onRead: (file: LibraryFileDto) => void;
}
