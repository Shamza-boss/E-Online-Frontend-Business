import type { GridRowModel } from '@mui/x-data-grid';
import type { AlertColor } from '@mui/material';
import { mutate } from 'swr';
import { updateUser } from '@/app/_lib/actions/users';
import type { UserDto } from '@/app/_lib/interfaces/types';

type ShowAlert = (type: AlertColor, message: string) => void;

export const processRowUpdate = async (
  newRow: GridRowModel,
  oldRow: GridRowModel,
  showAlert: ShowAlert,
): Promise<GridRowModel> => {
  try {
    const updated = (await updateUser(newRow as UserDto)) as UserDto;
    showAlert('success', 'User details updated successfully');

    mutate((current: UserDto[] | undefined) => {
      if (!current) {
        return current;
      }
      return current.map((user) =>
        user.userId === newRow.userId ? { ...user, ...updated } : user,
      );
    }, false);

    return { ...newRow, ...updated };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    showAlert('error', `Failed to update user: ${message}`);
    return oldRow;
  }
};
