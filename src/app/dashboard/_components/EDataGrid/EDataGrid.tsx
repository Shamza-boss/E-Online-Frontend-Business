import * as React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import type { GridColumnVisibilityModel } from '@mui/x-data-grid';
import type { EDataGridProps } from './types';
import { DEFAULT_DENSITY } from './constants';
import { mergeSlotProps } from './utils';
import { GridContainer, BaseDataGrid } from './elements';

function buildMobileVisibility(
  fields: string[] | undefined,
): GridColumnVisibilityModel | undefined {
  if (!fields?.length) return undefined;
  return Object.fromEntries(fields.map((field) => [field, false]));
}

export default function EDataGrid(props: EDataGridProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });

  const {
    sx,
    slotProps,
    checkboxSelection,
    disableRowSelectionOnClick,
    mobileHiddenFields,
    columnVisibilityModel,
    ...rest
  } = props;

  const mergedSlotProps = React.useMemo(
    () => mergeSlotProps(slotProps),
    [slotProps],
  );

  const resolvedVisibility = React.useMemo(():
    | GridColumnVisibilityModel
    | undefined => {
    const mobileModel = isMobile
      ? buildMobileVisibility(mobileHiddenFields)
      : undefined;
    if (!mobileModel && !columnVisibilityModel) return columnVisibilityModel;
    return { ...columnVisibilityModel, ...mobileModel };
  }, [columnVisibilityModel, isMobile, mobileHiddenFields]);

  return (
    <GridContainer $isMobile={isMobile}>
      <BaseDataGrid
        {...rest}
        sx={sx}
        checkboxSelection={checkboxSelection}
        disableRowSelectionOnClick={disableRowSelectionOnClick}
        density={DEFAULT_DENSITY}
        slotProps={mergedSlotProps}
        columnVisibilityModel={resolvedVisibility}
      />
    </GridContainer>
  );
}
