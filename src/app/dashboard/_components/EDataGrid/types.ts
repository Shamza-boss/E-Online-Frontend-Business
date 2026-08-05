import type * as React from 'react';
import type { GridColumnVisibilityModel } from '@mui/x-data-grid';
import {
  type DataGridPropsWithDefaultValues,
  type DataGridPropsWithComplexDefaultValueBeforeProcessing,
  type DataGridPropsWithoutDefaultValue,
  type DataGridForcedPropsKey,
} from '@mui/x-data-grid/internals';

export type EDataGridProps = React.JSX.IntrinsicAttributes &
  Omit<
    Partial<DataGridPropsWithDefaultValues<any>> &
      DataGridPropsWithComplexDefaultValueBeforeProcessing &
      DataGridPropsWithoutDefaultValue<any>,
    DataGridForcedPropsKey
  > & {
    pagination?: true;
    /**
     * Column fields hidden on `sm` and below. Merged into `columnVisibilityModel`
     * when the viewport is mobile; desktop keeps the caller-provided model.
     */
    mobileHiddenFields?: string[];
  } & React.RefAttributes<HTMLDivElement>;

export type { GridColumnVisibilityModel };
