import { createTheme, alpha, type PaletteMode, type Shadows } from '@mui/material/styles';

declare module '@mui/material/Paper' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- module augmentation requires interface
  interface PaperPropsVariantOverrides {
    highlighted: true;
  }
}
declare module '@mui/material/styles' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- module augmentation requires interface
  interface ColorRange {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- module augmentation requires interface
  interface PaletteColor extends ColorRange {}

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- module augmentation requires interface
  interface Palette {
    baseShadow: string;
  }
}

const defaultTheme = createTheme();

const customShadows: Shadows = [...defaultTheme.shadows];

export const brand = {
  50: 'hsl(217, 90%, 96%)',
  100: 'hsl(217, 85%, 92%)',
  200: 'hsl(217, 80%, 84%)',
  300: 'hsl(217, 75%, 72%)',
  400: 'hsl(217, 90%, 58%)',
  500: 'hsl(217, 90%, 50%)',
  600: 'hsl(217, 90%, 42%)',
  700: 'hsl(217, 90%, 34%)',
  800: 'hsl(217, 90%, 24%)',
  900: 'hsl(217, 90%, 16%)',
};

export const gray = {
  50: 'hsl(210, 20%, 98%)',
  100: 'hsl(210, 18%, 95%)',
  200: 'hsl(210, 15%, 90%)',
  300: 'hsl(210, 12%, 82%)',
  400: 'hsl(210, 10%, 65%)',
  500: 'hsl(210, 10%, 50%)',
  600: 'hsl(210, 12%, 40%)',
  700: 'hsl(210, 14%, 30%)',
  800: 'hsl(210, 16%, 20%)',
  900: 'hsl(210, 18%, 12%)',
};

export const green = {
  50: 'hsl(142, 70%, 95%)',
  100: 'hsl(142, 65%, 88%)',
  200: 'hsl(142, 60%, 78%)',
  300: 'hsl(142, 55%, 65%)',
  400: 'hsl(142, 70%, 45%)',
  500: 'hsl(142, 75%, 36%)',
  600: 'hsl(142, 80%, 28%)',
  700: 'hsl(142, 82%, 22%)',
  800: 'hsl(142, 85%, 16%)',
  900: 'hsl(142, 88%, 10%)',
};

export const orange = {
  50: 'hsl(43, 100%, 95%)',
  100: 'hsl(43, 95%, 88%)',
  200: 'hsl(43, 90%, 78%)',
  300: 'hsl(43, 85%, 62%)',
  400: 'hsl(43, 95%, 48%)',
  500: 'hsl(36, 95%, 45%)',
  600: 'hsl(30, 95%, 38%)',
  700: 'hsl(25, 95%, 30%)',
  800: 'hsl(20, 95%, 22%)',
  900: 'hsl(15, 95%, 15%)',
};

export const red = {
  50: 'hsl(4, 90%, 96%)',
  100: 'hsl(4, 85%, 90%)',
  200: 'hsl(4, 80%, 82%)',
  300: 'hsl(4, 75%, 70%)',
  400: 'hsl(4, 85%, 58%)',
  500: 'hsl(4, 85%, 48%)',
  600: 'hsl(4, 85%, 40%)',
  700: 'hsl(4, 85%, 32%)',
  800: 'hsl(4, 85%, 22%)',
  900: 'hsl(4, 85%, 14%)',
};

export const getDesignTokens = (mode: PaletteMode) => {
  customShadows[1] =
    mode === 'dark'
      ? 'hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px'
      : 'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px';

  return {
    palette: {
      mode,
      primary: {
        light: brand[200],
        main: brand[400],
        dark: brand[700],
        contrastText: brand[50],
        ...(mode === 'dark' && {
          contrastText: brand[50],
          light: brand[300],
          main: brand[400],
          dark: brand[700],
        }),
      },
      info: {
        light: brand[100],
        main: brand[300],
        dark: brand[600],
        contrastText: gray[50],
        ...(mode === 'dark' && {
          contrastText: brand[300],
          light: brand[500],
          main: brand[700],
          dark: brand[900],
        }),
      },
      warning: {
        light: orange[300],
        main: orange[400],
        dark: orange[800],
        ...(mode === 'dark' && {
          light: orange[400],
          main: orange[500],
          dark: orange[700],
        }),
      },
      error: {
        light: red[300],
        main: red[400],
        dark: red[800],
        ...(mode === 'dark' && {
          light: red[400],
          main: red[500],
          dark: red[700],
        }),
      },
      success: {
        light: green[300],
        main: green[400],
        dark: green[800],
        ...(mode === 'dark' && {
          light: green[400],
          main: green[500],
          dark: green[700],
        }),
      },
      grey: { ...gray },
      divider: mode === 'dark' ? alpha(gray[700], 0.6) : alpha(gray[400], 0.5),
      background: {
        default: 'hsl(200, 20%, 98%)',
        paper: 'hsl(0, 0%, 100%)',
        ...(mode === 'dark' && {
          default: gray[900],
          paper: 'hsl(210, 18%, 8%)',
        }),
      },
      text: {
        primary: gray[800],
        secondary: gray[600],
        warning: orange[400],
        ...(mode === 'dark' && {
          primary: 'hsl(0, 0%, 100%)',
          secondary: gray[400],
        }),
      },
      action: {
        hover: alpha(gray[200], 0.2),
        selected: `${alpha(gray[200], 0.3)}`,
        ...(mode === 'dark' && {
          hover: alpha(gray[600], 0.2),
          selected: alpha(gray[600], 0.3),
        }),
      },
    },
    typography: {
      fontFamily: ['var(--font-manrope, Manrope)', 'Inter', 'sans-serif'].join(
        ','
      ),
      h1: {
        fontSize: defaultTheme.typography.pxToRem(48),
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: -0.5,
      },
      h2: {
        fontSize: defaultTheme.typography.pxToRem(36),
        fontWeight: 600,
        lineHeight: 1.2,
      },
      h3: { fontSize: defaultTheme.typography.pxToRem(30), lineHeight: 1.2 },
      h4: {
        fontSize: defaultTheme.typography.pxToRem(24),
        fontWeight: 600,
        lineHeight: 1.5,
      },
      h5: { fontSize: defaultTheme.typography.pxToRem(20), fontWeight: 600 },
      h6: { fontSize: defaultTheme.typography.pxToRem(18), fontWeight: 600 },
      subtitle1: { fontSize: defaultTheme.typography.pxToRem(18) },
      subtitle2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 500,
      },
      body1: { fontSize: defaultTheme.typography.pxToRem(14) },
      body2: { fontSize: defaultTheme.typography.pxToRem(14), fontWeight: 400 },
      caption: {
        fontSize: defaultTheme.typography.pxToRem(12),
        fontWeight: 400,
      },
    },
    shape: { borderRadius: 8 },
    shadows: customShadows,
  };
};

export const colorSchemes = {
  light: {
    palette: {
      primary: {
        light: brand[200],
        main: brand[400],
        dark: brand[700],
        contrastText: brand[50],
      },
      info: {
        light: brand[100],
        main: brand[300],
        dark: brand[600],
        contrastText: gray[50],
      },
      warning: { light: orange[300], main: orange[400], dark: orange[800] },
      error: { light: red[300], main: red[400], dark: red[800] },
      success: { light: green[300], main: green[400], dark: green[800] },
      grey: { ...gray },
      divider: alpha(gray[300], 0.35),
      background: { default: 'hsl(200, 20%, 98%)', paper: 'hsl(0, 0%, 100%)' },
      text: { primary: gray[700], secondary: gray[500], warning: orange[400] },
      action: {
        hover: alpha(gray[200], 0.2),
        selected: `${alpha(gray[200], 0.3)}`,
      },
      baseShadow:
        'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px',
    },
  },
  dark: {
    palette: {
      primary: {
        contrastText: brand[50],
        light: brand[300],
        main: brand[400],
        dark: brand[700],
      },
      info: {
        contrastText: brand[300],
        light: brand[500],
        main: brand[700],
        dark: brand[900],
      },
      warning: { light: orange[400], main: orange[500], dark: orange[700] },
      error: { light: red[400], main: red[500], dark: red[700] },
      success: { light: green[400], main: green[500], dark: green[700] },
      grey: { ...gray },
      divider: alpha(gray[700], 0.5),
      background: { default: gray[900], paper: 'hsl(210, 18%, 8%)' },
      text: { primary: 'hsl(210, 15%, 95%)', secondary: gray[400] },
      action: { hover: alpha(gray[600], 0.2), selected: alpha(gray[600], 0.3) },
      baseShadow:
        'hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px',
    },
  },
};

export const typography = {
  fontFamily: ['"Inter", "sans-serif"'].join(','),
  h1: {
    fontSize: defaultTheme.typography.pxToRem(48),
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: defaultTheme.typography.pxToRem(36),
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h3: { fontSize: defaultTheme.typography.pxToRem(30), lineHeight: 1.2 },
  h4: {
    fontSize: defaultTheme.typography.pxToRem(24),
    fontWeight: 600,
    lineHeight: 1.5,
  },
  h5: { fontSize: defaultTheme.typography.pxToRem(20), fontWeight: 600 },
  h6: { fontSize: defaultTheme.typography.pxToRem(18), fontWeight: 600 },
  subtitle1: { fontSize: defaultTheme.typography.pxToRem(18) },
  subtitle2: { fontSize: defaultTheme.typography.pxToRem(14), fontWeight: 500 },
  body1: { fontSize: defaultTheme.typography.pxToRem(14) },
  body2: { fontSize: defaultTheme.typography.pxToRem(14), fontWeight: 400 },
  caption: { fontSize: defaultTheme.typography.pxToRem(12), fontWeight: 400 },
};

export const shape = { borderRadius: 14 };

// @ts-ignore
const defaultShadows: Shadows = [
  'none',
  'var(--template-palette-baseShadow)',
  ...defaultTheme.shadows.slice(2),
];
export const shadows = defaultShadows;
