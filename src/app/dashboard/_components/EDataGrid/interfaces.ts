import * as React from 'react';
import {
  DataGridPropsWithDefaultValues,
  DataGridPropsWithComplexDefaultValueBeforeProcessing,
  DataGridPropsWithoutDefaultValue,
  DataGridForcedPropsKey,
} from '@mui/x-data-grid/internals';

export type EDataGridProps = React.JSX.IntrinsicAttributes &
  Omit<
    Partial<DataGridPropsWithDefaultValues<any>> &
      DataGridPropsWithComplexDefaultValueBeforeProcessing &
      DataGridPropsWithoutDefaultValue<any>,
    DataGridForcedPropsKey
  > & { pagination?: true } & React.RefAttributes<HTMLDivElement>;
