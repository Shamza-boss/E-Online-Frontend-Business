import { Theme, alpha, Components } from '@mui/material/styles';
import { gray, orange } from '../themePrimitives';

export const feedbackCustomizations: Components<Theme> = {
  MuiAlert: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 10,
        alignItems: 'center',
      }),
      standardWarning: ({ theme }) => ({
        backgroundColor: orange[100],
        color: theme.palette.text.primary,
        border: `1px solid ${alpha(orange[300], 0.5)}`,
        '& .MuiAlert-icon': { color: orange[500] },
        ...theme.applyStyles('dark', {
          backgroundColor: `${alpha(orange[900], 0.5)}`,
          border: `1px solid ${alpha(orange[800], 0.5)}`,
        }),
      }),
      standardInfo: ({ theme }) => ({
        backgroundColor: alpha(theme.palette.info.light, 0.15),
        color: theme.palette.text.primary,
        border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
        '& .MuiAlert-icon': { color: theme.palette.info.main },
        ...theme.applyStyles('dark', {
          backgroundColor: alpha(theme.palette.info.dark, 0.2),
          border: `1px solid ${alpha(theme.palette.info.dark, 0.4)}`,
        }),
      }),
      standardSuccess: ({ theme }) => ({
        backgroundColor: alpha(theme.palette.success.light, 0.15),
        color: theme.palette.text.primary,
        border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
        '& .MuiAlert-icon': { color: theme.palette.success.main },
        ...theme.applyStyles('dark', {
          backgroundColor: alpha(theme.palette.success.dark, 0.2),
          border: `1px solid ${alpha(theme.palette.success.dark, 0.4)}`,
        }),
      }),
      standardError: ({ theme }) => ({
        backgroundColor: alpha(theme.palette.error.light, 0.15),
        color: theme.palette.text.primary,
        border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
        '& .MuiAlert-icon': { color: theme.palette.error.main },
        ...theme.applyStyles('dark', {
          backgroundColor: alpha(theme.palette.error.dark, 0.2),
          border: `1px solid ${alpha(theme.palette.error.dark, 0.4)}`,
        }),
      }),
    },
  },
  MuiDialog: {
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiDialog-paper': {
          borderRadius: '10px',
          border: '1px solid',
          borderColor: theme.palette.divider,
        },
      }),
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: ({ theme }) => ({
        height: 8,
        borderRadius: 8,
        backgroundColor: gray[200],
        ...theme.applyStyles('dark', {
          backgroundColor: gray[800],
        }),
      }),
    },
  },
};
