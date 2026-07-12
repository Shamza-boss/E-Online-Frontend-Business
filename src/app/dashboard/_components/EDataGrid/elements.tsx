import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

type GridContainerProps = {
  $isMobile: boolean;
}

export const GridContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$isMobile',
})<GridContainerProps>(({ $isMobile }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: $isMobile ? 'none' : 1,
  boxSizing: 'border-box',
  height: '100%',
  width: $isMobile ? '100%' : 'auto',
  minHeight: $isMobile ? 'auto' : 0,
  overflow: 'hidden',
}));

export const BaseDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 0,
  borderRadius: 0,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  '& .MuiDataGrid-main': {
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  '& .MuiDataGrid-columnHeaders': {
    flexShrink: 0,
    position: 'sticky',
    top: 0,
    zIndex: 2,
  },
  '& .MuiDataGrid-virtualScroller': {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
  },
  '& .MuiDataGrid-footerContainer': {
    flexShrink: 0,
  },
  '& .MuiDataGrid-row': {
    transition:
      'opacity 0.3s ease-in-out, background-color 0.3s ease-in-out, transform 0.3s ease-in-out',
  },
  '& .MuiDataGrid-row.row-deleted': {
    opacity: 0,
    transform: 'translateX(-20px)',
    backgroundColor: theme.palette.error.light,
  },
  '& .MuiDataGrid-row.row-updated': {
    animation: 'rowFlash 0.6s ease-in-out',
  },
  '@keyframes rowFlash': {
    '0%': {
      backgroundColor: theme.palette.success.light,
    },
    '100%': {
      backgroundColor: 'transparent',
    },
  },
})) as typeof DataGrid;
