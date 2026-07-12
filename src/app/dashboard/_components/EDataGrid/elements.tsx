import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

/**
 * Fills the parent flex shell and scrolls rows inside the virtual scroller.
 * Same behavior on mobile and desktop (library table pattern).
 */
export const GridContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  boxSizing: 'border-box',
  width: '100%',
  height: '100%',
  minWidth: 0,
  minHeight: 0,
  overflow: 'hidden',
  // When an ancestor doesn't constrain height (e.g. scrollable dashboard cards),
  // keep a usable vertical scroll viewport on small screens.
  [theme.breakpoints.down('md')]: {
    minHeight: theme.spacing(45),
  },
}));

export const BaseDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 0,
  borderRadius: 0,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  minHeight: 0,
  minWidth: 0,
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
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
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
