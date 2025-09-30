import { Theme as MuiTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    vars: {
      [key: string]: string;
    };
  }

  interface ThemeOptions {
    vars?: {
      [key: string]: string;
    };
  }
}
