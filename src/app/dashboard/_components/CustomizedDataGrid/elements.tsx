import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

export const StyledDataGrid = styled(DataGrid)({
  '& .MuiDataGrid-root': {
    overflow: 'auto',
  },
  '& .MuiDataGrid-virtualScroller': {
    overflow: 'auto',
  },
}) as typeof DataGrid;
