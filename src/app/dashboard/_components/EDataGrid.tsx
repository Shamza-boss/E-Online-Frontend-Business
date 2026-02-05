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
  // Use noSsr to prevent state update before component mounts
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });

  const { sx, slotProps, checkboxSelection, disableRowSelectionOnClick, ...rest } = props as any;

  const baseGridSx = React.useMemo(() => {
    const core = {
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
      // Row animation styles for updates and deletes
      '& .MuiDataGrid-row': {
        transition: 'opacity 0.3s ease-in-out, background-color 0.3s ease-in-out, transform 0.3s ease-in-out',
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
    };

    if (!sx) {
      return core;
    }

    return Array.isArray(sx) ? [core, ...sx] : [core, sx];
  }, [sx, theme.palette.error.light, theme.palette.success.light]);

  const mergedSlotProps = React.useMemo(() => {
    const defaultFilterPanel = {
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
    };

    const incoming = slotProps ?? {};
    const incomingFilterPanel = incoming.filterPanel ?? {};
    const incomingFilterFormProps = incomingFilterPanel.filterFormProps ?? {};

    return {
      ...incoming,
      filterPanel: {
        ...defaultFilterPanel,
        ...incomingFilterPanel,
        filterFormProps: {
          ...defaultFilterPanel.filterFormProps,
          ...incomingFilterFormProps,
          logicOperatorInputProps: {
            ...defaultFilterPanel.filterFormProps.logicOperatorInputProps,
            ...incomingFilterFormProps.logicOperatorInputProps,
          },
          columnInputProps: {
            ...defaultFilterPanel.filterFormProps.columnInputProps,
            ...incomingFilterFormProps.columnInputProps,
          },
          operatorInputProps: {
            ...defaultFilterPanel.filterFormProps.operatorInputProps,
            ...incomingFilterFormProps.operatorInputProps,
          },
          valueInputProps: {
            ...defaultFilterPanel.filterFormProps.valueInputProps,
            ...incomingFilterFormProps.valueInputProps,
            InputComponentProps: {
              ...defaultFilterPanel.filterFormProps.valueInputProps
                .InputComponentProps,
              ...incomingFilterFormProps.valueInputProps?.InputComponentProps,
            },
          },
        },
      },
    };
  }, [slotProps]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: isMobile ? 'none' : 1, // Disable flex on mobile
        boxSizing: 'border-box',
        height: '100%',
        width: isMobile ? '100%' : 'auto', // Full width on mobile
        minHeight: isMobile ? 'auto' : 0, // Remove min-height constraint on mobile
        overflow: 'hidden',
      }}
    >
      <DataGrid
        {...rest}
        sx={baseGridSx}
        checkboxSelection={checkboxSelection}
        disableRowSelectionOnClick={disableRowSelectionOnClick}
        //Make densiity controlable
        density="standard"
        slotProps={mergedSlotProps}
      />
    </Box>
  );
}
