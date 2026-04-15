import { DEFAULT_FILTER_FORM_PROPS } from './constants';

export function mergeSlotProps(slotProps: any): any {
  const incoming = slotProps ?? {};
  const incomingFilterPanel = incoming.filterPanel ?? {};
  const incomingFilterFormProps = incomingFilterPanel.filterFormProps ?? {};

  return {
    ...incoming,
    filterPanel: {
      ...{ filterFormProps: DEFAULT_FILTER_FORM_PROPS },
      ...incomingFilterPanel,
      filterFormProps: {
        ...DEFAULT_FILTER_FORM_PROPS,
        ...incomingFilterFormProps,
        logicOperatorInputProps: {
          ...DEFAULT_FILTER_FORM_PROPS.logicOperatorInputProps,
          ...incomingFilterFormProps.logicOperatorInputProps,
        },
        columnInputProps: {
          ...DEFAULT_FILTER_FORM_PROPS.columnInputProps,
          ...incomingFilterFormProps.columnInputProps,
        },
        operatorInputProps: {
          ...DEFAULT_FILTER_FORM_PROPS.operatorInputProps,
          ...incomingFilterFormProps.operatorInputProps,
        },
        valueInputProps: {
          ...DEFAULT_FILTER_FORM_PROPS.valueInputProps,
          ...incomingFilterFormProps.valueInputProps,
          InputComponentProps: {
            ...DEFAULT_FILTER_FORM_PROPS.valueInputProps.InputComponentProps,
            ...incomingFilterFormProps.valueInputProps?.InputComponentProps,
          },
        },
      },
    },
  };
}
