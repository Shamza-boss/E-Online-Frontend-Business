'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Paper, { type PaperProps } from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

/** Mobile fullscreen charts keep a readable width and scroll sideways. */
export const DEFAULT_CHART_SCROLL_MIN_WIDTH = 640;

export const ChartScroll = styled(Box)(({ theme }) => ({
  width: '100%',
  minWidth: 0,
  [theme.breakpoints.down('md')]: {
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    overscrollBehaviorX: 'contain',
  },
}));

export const ChartScrollInner = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'minWidthPx',
})<{ minWidthPx?: number }>(({ theme, minWidthPx = DEFAULT_CHART_SCROLL_MIN_WIDTH }) => ({
  width: '100%',
  minWidth: 0,
  [theme.breakpoints.down('md')]: {
    minWidth: minWidthPx,
  },
}));

type ChartScrollAreaProps = {
  children: React.ReactNode;
  /** Min chart width below `md` before horizontal scroll kicks in. */
  minWidthPx?: number;
};

/** Drop-in host for any fullscreen detail chart (Bar/Line/Radar/PageViews). */
export function ChartScrollArea({
  children,
  minWidthPx = DEFAULT_CHART_SCROLL_MIN_WIDTH,
}: ChartScrollAreaProps) {
  return (
    <ChartScroll>
      <ChartScrollInner minWidthPx={minWidthPx}>{children}</ChartScrollInner>
    </ChartScroll>
  );
}

const ChartPanelRoot = styled(Paper)(({ theme }) => ({
  flex: '1 1 280px',
  minWidth: 0,
  width: '100%',
  padding: theme.spacing(2, 2.25),
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export type ChartPanelProps = PaperProps & {
  /** Min width for the scrollable chart body on small screens. */
  chartMinWidth?: number;
};

/**
 * Detail-modal chart surface: vertically stacks with peers; on small screens the
 * inner chart area scrolls horizontally so axes stay readable.
 */
export const ChartPanel = React.forwardRef<HTMLDivElement, ChartPanelProps>(
  function ChartPanel({ children, chartMinWidth, sx, ...other }, ref) {
    return (
      <ChartPanelRoot ref={ref} sx={sx} {...other}>
        <ChartScrollArea minWidthPx={chartMinWidth}>{children}</ChartScrollArea>
      </ChartPanelRoot>
    );
  },
);
