import * as React from 'react';
import TabPanel, { TabPanelProps } from '@mui/lab/TabPanel';
import { SxProps, Theme } from '@mui/material/styles';

export type DataGridTabPanelProps = TabPanelProps;

const DataGridTabPanel = React.forwardRef<
  HTMLDivElement,
  DataGridTabPanelProps
>(({ sx, children, ...rest }, ref) => {
  const baseSx: SxProps<Theme> = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    padding: 0,
    overflow: 'hidden',
    '&[hidden]': {
      display: 'none',
    },
  };

  const resolvedSx: SxProps<Theme> = Array.isArray(sx)
    ? [baseSx, ...sx]
    : sx
      ? [baseSx, sx]
      : baseSx;

  return (
    <TabPanel ref={ref} {...rest} sx={resolvedSx}>
      {children}
    </TabPanel>
  );
});

DataGridTabPanel.displayName = 'DataGridTabPanel';

export default DataGridTabPanel;
