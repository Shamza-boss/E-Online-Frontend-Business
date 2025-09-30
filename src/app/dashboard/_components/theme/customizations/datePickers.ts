import { alpha, Theme } from '@mui/material/styles';
import type { PickerComponents } from '@mui/x-date-pickers/themeAugmentation';
import { menuItemClasses } from '@mui/material/MenuItem';
import { pickersInputClasses } from '@mui/x-date-pickers';
import {
  gray,
  brand,
} from '../../../../_lib/components/shared-theme/themePrimitives';

export const datePickersCustomizations: PickerComponents<Theme> = {
  MuiPickerPopper: {
    styleOverrides: {
      paper: ({ theme }) => ({
        marginTop: 4,
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.divider}`,
        backgroundImage: 'none',
        background: 'hsl(0, 0%, 100%)',
        boxShadow:
          'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px',
        [`& .${menuItemClasses.root}`]: { borderRadius: 6, margin: '0 6px' },
        ...theme.applyStyles('dark', {
          background: gray[900],
          boxShadow:
            'hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px',
        }),
      }),
    },
  },
  MuiPickersArrowSwitcher: {
    styleOverrides: {
      spacer: { width: 16 },
      button: ({ theme }) => ({
        backgroundColor: 'transparent',
        color: theme.palette.grey[500],
        ...theme.applyStyles('dark', { color: theme.palette.grey[400] }),
      }),
    },
  },
  MuiPickersCalendarHeader: {
    styleOverrides: { switchViewButton: { padding: 0, border: 'none' } },
  },
};
