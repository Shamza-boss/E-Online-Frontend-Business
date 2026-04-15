import type { GridRowModel } from '@mui/x-data-grid';
import { mutate } from 'swr';

export const processRowUpdate = async (
  newRow: GridRowModel,
  oldRow: GridRowModel,
  showAlert: (...args: any[]) => void
): Promise<GridRowModel> => {
  try {
    const res = await fetch(`/api/users/${newRow.userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRow),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }
    const updated = await res.json();
    showAlert('success', 'User details updated successfully');

    mutate((current: any) => {
      return current.map((user: any) =>
        user.userId === newRow.userId ? { ...user, ...updated } : user
      );
    }, false);

    return { ...newRow, ...updated };
  } catch (err: any) {
    showAlert('error', `Failed to update user: ${err.message}`);
    return oldRow;
  }
};
