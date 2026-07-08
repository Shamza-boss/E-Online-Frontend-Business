import type { LibraryFileDto } from '@/app/_lib/interfaces/types';

export interface LibraryGridProps {
  files: LibraryFileDto[];
  isFetching: boolean;
  onRead: (file: LibraryFileDto) => void;
}
