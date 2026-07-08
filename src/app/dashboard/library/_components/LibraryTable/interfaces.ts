import type {
  GridPaginationModel,
  GridSortModel,
} from '@mui/x-data-grid';
import type { LibraryFileDto } from '@/app/_lib/interfaces/types';

export interface LibraryTableProps {
  files: LibraryFileDto[];
  rowCount: number;
  loading: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  sortModel: GridSortModel;
  onSortModelChange: (model: GridSortModel) => void;
  onRead: (file: LibraryFileDto) => void;
}

export interface GridCellTextProps {
  children: React.ReactNode;
  title?: string;
}
