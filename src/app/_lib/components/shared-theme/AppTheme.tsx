import * as React from 'react';
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import { colorSchemes } from './themePrimitives';

interface AppThemeProps {
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
    main: '#1976d2',
    contrastText: '#fff',
  },
  secondary: {
    main: '#9c27b0',
    contrastText: '#fff',
  },
  background: {
    default: '#f5f5f5',
    paper: '#fff',
  },
  text: {
    primary: '#1a1a1a',
    secondary: '#555',
  },
  divider: '#e0e0e0',
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
  borderRadius: 8,
};

const shadows = [
  'none',
  '0px 1px 2px 0px rgba(60,60,60,0.05)',
  '0px 1.5px 4px 0px rgba(60,60,60,0.08)',
  '0px 2px 8px 0px rgba(60,60,60,0.10)',
  ...Array(21).fill('none'),
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
          defaultProps: {
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
