import { Theme as MuiTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  type Theme = {
    vars: {
      [key: string]: string;
    };
  }

  type ThemeOptions = {
    vars?: {
      [key: string]: string;
    };
  }
}
