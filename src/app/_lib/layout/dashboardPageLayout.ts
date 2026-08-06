/**
 * Shared dashboard page layout tokens.
 * Use these instead of fixed `p: 3` so small screens keep horizontal room
 * while md+ keeps the familiar desktop rhythm.
 *
 * Shell choice:
 * - `dashboardScrollablePageSx` — long content (card grids, billing stacks); parent scrolls
 * - `dashboardPageRootSx` — full-height flex shells with an *internal* scroll region
 *   (management tabs, library table, settings). Do not put unbounded card grids here
 *   without a `dashboardScrollRegionSx` child — overflow will clip.
 *
 * Typed as plain style objects (not `SxProps`) so they can be spread into `sx`
 * without MUI array/function union type errors.
 */
import type { Theme } from '@mui/material/styles';
import type { SystemStyleObject } from '@mui/system';

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

/** Outer page shell for full-height flex + internal scroll (datagrids, settings). */
export const dashboardPageRootSx: SystemStyleObject<Theme> = {
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
export const dashboardScrollablePageSx: SystemStyleObject<Theme> = {
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  p: dashboardPagePadding,
};

/** Flex child that fills remaining height without forcing overflow. */
export const dashboardFlexBodySx: SystemStyleObject<Theme> = {
  flex: '1 1 0%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  minHeight: 0,
  minWidth: 0,
  width: '100%',
};

/** Scrollable tab/content region inside a flex page shell. */
export const dashboardScrollRegionSx: SystemStyleObject<Theme> = {
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
