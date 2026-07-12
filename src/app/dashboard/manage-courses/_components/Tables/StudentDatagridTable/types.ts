import type { UserDto } from '@/app/_lib/interfaces/types';
import type { GridRowId } from '@mui/x-data-grid';

export type ManagementDataGridProps = {
  userData: UserDto[] | undefined;
  usersLoading: boolean;
  handleSeeHomeworkClick: (id: GridRowId) => () => void;
}
