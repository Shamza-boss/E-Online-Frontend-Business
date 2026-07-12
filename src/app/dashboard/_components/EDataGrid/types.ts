import type * as React from 'react';
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
  > & { pagination?: true } & React.RefAttributes<HTMLDivElement>;
