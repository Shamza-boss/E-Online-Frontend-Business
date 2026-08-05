'use client';

import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { GridColDef, GridValidRowModel } from '@mui/x-data-grid';
import { OutlinedWrapper } from '@/app/_lib/components/shared-theme/customizations/OutlinedWrapper';
import EDataGrid from '../EDataGrid';

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export type InsightDataGridProps<R extends GridValidRowModel> = {
  rows: R[];
  columns: GridColDef<R>[];
  emptyMessage: string;
  getRowId?: (row: R) => string | number;
  mobileHiddenFields?: string[];
  pageSizeOptions?: readonly number[];
  initialPageSize?: number;
};

/** Shared fullscreen-insight table: OutlinedWrapper + EDataGrid. */
export default function InsightDataGrid<R extends GridValidRowModel>({
  rows,
  columns,
  emptyMessage,
  getRowId,
  mobileHiddenFields,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  initialPageSize = 20,
}: InsightDataGridProps<R>) {
  const NoRowsOverlay = useMemo(
    () =>
      function InsightNoRowsOverlay() {
        return (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {emptyMessage}
            </Typography>
          </Box>
        );
      },
    [emptyMessage],
  );

  return (
    <OutlinedWrapper
      sx={{
        width: '100%',
        height: { xs: 420, md: 'calc(100dvh - 180px)' },
        minHeight: 360,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <EDataGrid
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        disableRowSelectionOnClick
        pageSizeOptions={[...pageSizeOptions]}
        initialState={{
          pagination: { paginationModel: { pageSize: initialPageSize, page: 0 } },
        }}
        mobileHiddenFields={mobileHiddenFields}
        slots={{ noRowsOverlay: NoRowsOverlay }}
        slotProps={{
          loadingOverlay: {
            variant: 'skeleton',
            noRowsVariant: 'skeleton',
          },
        }}
        sx={{
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
          },
        }}
      />
    </OutlinedWrapper>
  );
}
