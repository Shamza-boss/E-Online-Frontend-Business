import * as React from 'react';
import Box from '@mui/material/Box';
import type { CustomizedDataGridProps } from './types';
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  FILTER_PANEL_SLOT_PROPS,
} from './constants';
import { getColumnDefinitions, getRowClassName } from './utils';
import EDataGrid from '../EDataGrid';

export default function CustomizedDataGrid({
  rows,
  isLoading,
}: CustomizedDataGridProps) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: { xs: 360, md: 420 },
        minHeight: { xs: 360, md: 420 },
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <EDataGrid
        checkboxSelection={false}
        rows={rows}
        columns={getColumnDefinitions()}
        getRowClassName={(params) =>
          getRowClassName(params.indexRelativeToCurrentPage)
        }
        initialState={{
          pagination: { paginationModel: { pageSize: DEFAULT_PAGE_SIZE } },
        }}
        pageSizeOptions={[...PAGE_SIZE_OPTIONS]}
        loading={isLoading}
        slotProps={FILTER_PANEL_SLOT_PROPS}
        disableRowSelectionOnClick
      />
    </Box>
  );
}
