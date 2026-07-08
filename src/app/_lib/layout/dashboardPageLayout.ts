import type { SxProps, Theme } from '@mui/material/styles';

/**
 * Shared dashboard page layout tokens.
 * Use these instead of fixed `p: 3` so small screens keep horizontal room
 * while md+ keeps the familiar desktop rhythm.
 */
export const dashboardPagePadding = {
  xs: 1.5,
  sm: 2,
  md: 3,
} as const;

export const dashboardSectionSpacing = {
  xs: 2,
  sm: 2.5,
  md: 3,
} as const;

export const dashboardGridSpacing = {
  xs: 1.5,
  sm: 2,
  md: 2,
} as const;

/** Outer page shell used by most dashboard routes. */
export const dashboardPageRootSx: SxProps<Theme> = {
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  boxSizing: 'border-box',
  minWidth: 0,
  p: dashboardPagePadding,
};

/**
 * Page shell for routes whose content grows vertically (card grids, long forms).
 * Lets the dashboard `ChildrenContainer` scroll instead of clipping overflow.
 */
export const dashboardScrollablePageSx: SxProps<Theme> = {
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  p: dashboardPagePadding,
};

/** Flex child that fills remaining height without forcing overflow. */
export const dashboardFlexBodySx: SxProps<Theme> = {
  flex: '1 1 0%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  minHeight: 0,
  minWidth: 0,
  width: '100%',
};

/** Scrollable tab/content region inside a flex page shell. */
export const dashboardScrollRegionSx: SxProps<Theme> = {
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  width: '100%',
  overflowY: 'auto',
  overflowX: 'hidden',
  WebkitOverflowScrolling: 'touch',
};

/** Responsive padding for styled components (theme.spacing). */
export function getDashboardPagePadding(theme: Theme) {
  return {
    paddingLeft: theme.spacing(dashboardPagePadding.xs),
    paddingRight: theme.spacing(dashboardPagePadding.xs),
    paddingTop: theme.spacing(dashboardPagePadding.xs),
    paddingBottom: theme.spacing(dashboardPagePadding.xs),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(dashboardPagePadding.sm),
      paddingRight: theme.spacing(dashboardPagePadding.sm),
      paddingTop: theme.spacing(dashboardPagePadding.sm),
      paddingBottom: theme.spacing(dashboardPagePadding.sm),
    },
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(dashboardPagePadding.md),
      paddingRight: theme.spacing(dashboardPagePadding.md),
      paddingTop: theme.spacing(dashboardPagePadding.md),
      paddingBottom: theme.spacing(dashboardPagePadding.md),
    },
  };
}
