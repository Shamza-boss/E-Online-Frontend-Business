'use client';

import * as React from 'react';
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import { colorSchemes } from './themePrimitives';
import {
  dataDisplayCustomizations,
  feedbackCustomizations,
  inputsCustomizations,
  navigationCustomizations,
  surfacesCustomizations,
} from './customizations';

type AppThemeProps = {
  children: React.ReactNode;
  /**
   * This is for the docs site. You can ignore it or remove it.
   */
  disableCustomTheme?: boolean;
  themeComponents?: ThemeOptions['components'];
}

// Define your palette here (default to light mode, or use a prop/context to switch)
const palette: ThemeOptions['palette'] = {
  mode: 'light',
  primary: {
    main: 'hsl(217, 90%, 58%)',
    light: 'hsl(217, 85%, 72%)',
    dark: 'hsl(217, 90%, 42%)',
    contrastText: '#fff',
  },
  secondary: {
    main: 'hsl(210, 14%, 38%)',
    light: 'hsl(210, 12%, 55%)',
    dark: 'hsl(210, 16%, 28%)',
    contrastText: '#fff',
  },
  background: {
    default: 'hsl(210, 20%, 98%)',
    paper: '#fff',
  },
  text: {
    primary: 'hsl(210, 14%, 25%)',
    secondary: 'hsl(210, 10%, 45%)',
  },
  divider: 'hsl(210, 15%, 90%)',
};

const typography: ThemeOptions['typography'] = {
  fontFamily: [
    'Inter',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),
  h1: { fontWeight: 700, fontSize: '2.5rem', letterSpacing: '-0.01562em' },
  h2: { fontWeight: 700, fontSize: '2rem', letterSpacing: '-0.00833em' },
  h3: { fontWeight: 700, fontSize: '1.75rem' },
  h4: { fontWeight: 600, fontSize: '1.5rem' },
  h5: { fontWeight: 600, fontSize: '1.25rem' },
  h6: { fontWeight: 600, fontSize: '1rem' },
  subtitle1: { fontWeight: 500, fontSize: '1rem' },
  subtitle2: { fontWeight: 500, fontSize: '0.875rem' },
  body1: { fontWeight: 400, fontSize: '1rem' },
  body2: { fontWeight: 400, fontSize: '0.875rem' },
  button: { fontWeight: 600, fontSize: '0.875rem', textTransform: 'none' },
};

const shape: ThemeOptions['shape'] = {
  borderRadius: 14,
};

const shadows = [
  'none',
  'none',
  'none',
  'none',
  'none',
  ...Array(20).fill('none'),
] as const as ThemeOptions['shadows'];

export default function AppTheme({
  children,
  disableCustomTheme,
  themeComponents,
}: AppThemeProps) {
  const theme = React.useMemo(() => {
    if (disableCustomTheme) return {};
    let baseTheme = createTheme({
      palette,
      colorSchemes,
      typography,
      shape,
      shadows,
      components: {
        ...surfacesCustomizations,
        MuiAppBar: navigationCustomizations.MuiAppBar,
        MuiTextField: {
          defaultProps: {
            size: 'small',
          },
        },
        MuiSelect: {
          defaultProps: {
            size: 'small',
          },
        },
        MuiAutocomplete: {
          defaultProps: {
            size: 'small',
          },
        },
        MuiFormControl: {
          defaultProps: {
            size: 'small',
          },
        },
        MuiInputBase: {
          ...(inputsCustomizations.MuiInputBase ?? {}),
          defaultProps: {
            ...(inputsCustomizations.MuiInputBase?.defaultProps ?? {}),
            size: 'small',
          },
        },
        ...themeComponents,
      },
    });
    baseTheme = responsiveFontSizes(baseTheme);
    return baseTheme;
  }, [disableCustomTheme, themeComponents]);

  if (disableCustomTheme) {
    return <>{children}</>;
  }
  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
