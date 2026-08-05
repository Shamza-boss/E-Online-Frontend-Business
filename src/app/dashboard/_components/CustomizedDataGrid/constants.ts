export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;
export const DATE_FORMAT = 'MM/dd/yyyy';

const SMALL_INPUT_PROPS = { variant: 'outlined' as const, size: 'small' as const };

export const FILTER_PANEL_SLOT_PROPS = {
  filterPanel: {
    filterFormProps: {
      logicOperatorInputProps: SMALL_INPUT_PROPS,
      columnInputProps: SMALL_INPUT_PROPS,
      operatorInputProps: SMALL_INPUT_PROPS,
      valueInputProps: {
        InputComponentProps: SMALL_INPUT_PROPS,
      },
    },
  },
};
