import * as React from 'react';
import type { CustomizedDataGridProps } from './interfaces';
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  FILTER_PANEL_SLOT_PROPS,
} from './constants';
import { getColumnDefinitions, getRowClassName } from './utils';
import { StyledDataGrid } from './elements';

export default function CustomizedDataGrid({
  rows,
  isLoading,
}: CustomizedDataGridProps) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <StyledDataGrid
      checkboxSelection={false}
      rows={rows}
      columns={getColumnDefinitions()}
      getRowClassName={(params) => getRowClassName(params.indexRelativeToCurrentPage)}
      initialState={{
        pagination: { paginationModel: { pageSize: DEFAULT_PAGE_SIZE } },
      }}
      pageSizeOptions={[...PAGE_SIZE_OPTIONS]}
      loading={isLoading}
      slotProps={FILTER_PANEL_SLOT_PROPS}
    />
  );
}
