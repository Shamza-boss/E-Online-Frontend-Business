import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  DataGridPropsWithDefaultValues,
  DataGridPropsWithComplexDefaultValueBeforeProcessing,
  DataGridPropsWithoutDefaultValue,
  DataGridForcedPropsKey,
} from '@mui/x-data-grid/internals';
import { Box, useMediaQuery, useTheme } from '@mui/material';

export default function EDataGrid(
  props: React.JSX.IntrinsicAttributes &
    Omit<
      Partial<DataGridPropsWithDefaultValues<any>> &
        DataGridPropsWithComplexDefaultValueBeforeProcessing &
        DataGridPropsWithoutDefaultValue<any>,
      DataGridForcedPropsKey
    > & { pagination?: true } & React.RefAttributes<HTMLDivElement>
) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        flex: isMobile ? 'none' : 1, // Disable flex on mobile
        boxSizing: 'border-box',
        height: '100%',
        maxHeight: 'calc(80vh - 42px)',
        width: isMobile ? '100%' : 'auto', // Full width on mobile
        minHeight: isMobile ? 'auto' : 0, // Remove min-height constraint on mobile
      }}
    >
      <DataGrid
        {...props}
        sx={{
          border: 0,
          borderRadius: 0,
        }}
        //Make densiity controlable
        density="standard"
        slotProps={{
          filterPanel: {
            filterFormProps: {
              logicOperatorInputProps: {
                variant: 'outlined',
                size: 'small',
              },
              columnInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { mt: 'auto' },
              },
              operatorInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { mt: 'auto' },
              },
              valueInputProps: {
                InputComponentProps: {
                  variant: 'outlined',
                  size: 'small',
                },
              },
            },
          },
        }}
      />
    </Box>
  );
}
