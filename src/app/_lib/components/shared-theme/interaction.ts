import { type Theme } from '@mui/material/styles';

/** Shared hover/selected color for links and side-nav interactive text. */
export function interactiveHoverColor(theme: Theme) {
  return theme.palette.primary.main;
}
