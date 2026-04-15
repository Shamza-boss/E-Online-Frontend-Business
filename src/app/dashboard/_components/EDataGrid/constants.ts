export const DEFAULT_DENSITY = 'standard' as const;

export const DEFAULT_FILTER_FORM_PROPS = {
  logicOperatorInputProps: {
    variant: 'outlined' as const,
    size: 'small' as const,
  },
  columnInputProps: {
    variant: 'outlined' as const,
    size: 'small' as const,
    sx: { mt: 'auto' },
  },
  operatorInputProps: {
    variant: 'outlined' as const,
    size: 'small' as const,
    sx: { mt: 'auto' },
  },
  valueInputProps: {
    InputComponentProps: {
      variant: 'outlined' as const,
      size: 'small' as const,
    },
  },
};
