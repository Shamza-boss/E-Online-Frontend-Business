import * as React from 'react';
import type { CustomizedDataGridProps } from './interfaces';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from './constants';
import { getColumnDefinitions } from './utils';
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

  const columns = getColumnDefinitions();

  return (
    <StyledDataGrid
      checkboxSelection={false}
      rows={rows}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
      }
      initialState={{
        pagination: { paginationModel: { pageSize: DEFAULT_PAGE_SIZE } },
      }}
      pageSizeOptions={[...PAGE_SIZE_OPTIONS]}
      loading={isLoading}
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
            },
            operatorInputProps: {
              variant: 'outlined',
              size: 'small',
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
  );
}
