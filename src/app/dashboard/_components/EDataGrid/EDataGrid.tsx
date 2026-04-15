import * as React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import type { EDataGridProps } from './interfaces';
import { DEFAULT_DENSITY } from './constants';
import { mergeSlotProps } from './utils';
import { GridContainer, BaseDataGrid } from './elements';

export default function EDataGrid(props: EDataGridProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });

  const { sx, slotProps, checkboxSelection, disableRowSelectionOnClick, ...rest } =
    props as any;

  const mergedSlotProps = React.useMemo(
    () => mergeSlotProps(slotProps),
    [slotProps],
  );

  return (
    <GridContainer $isMobile={isMobile}>
      <BaseDataGrid
        {...rest}
        sx={sx}
        checkboxSelection={checkboxSelection}
        disableRowSelectionOnClick={disableRowSelectionOnClick}
        density={DEFAULT_DENSITY}
        slotProps={mergedSlotProps}
      />
    </GridContainer>
  );
}
