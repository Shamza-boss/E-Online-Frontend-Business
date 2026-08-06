'use client';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import NextLink from 'next/link';
import type { Route } from 'next';

const PreviewRoot = styled(Stack)(({ theme }) => ({
  width: '100%',
  minHeight: 0,
  flex: 1,
  justifyContent: 'center',
  gap: theme.spacing(0.75),
  overflow: 'hidden',
  // Re-enable interaction inside chart slots that disable pointer events.
  pointerEvents: 'auto',
}));

const PreviewRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  minWidth: 0,
  paddingBottom: theme.spacing(0.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
    paddingBottom: 0,
  },
}));

export type InsightListPreviewItem = {
  id: string;
  primary: string;
  secondary?: string;
  /** Extends colored accents (calm blue / time green / soon orange / urgent red). */
  tone?: 'calm' | 'time' | 'soon' | 'urgent' | 'default' | 'warning' | 'error' | 'success';
  tooltip?: string;
  href?: string | null;
};

type InsightListPreviewProps = {
  items: InsightListPreviewItem[];
  emptyLabel?: string;
};

function accentColor(
  tone: InsightListPreviewItem['tone'],
): 'text.secondary' | 'primary.main' | 'success.main' | 'error.main' | 'warning.main' {
  if (tone === 'urgent' || tone === 'error') return 'error.main';
  if (tone === 'soon' || tone === 'warning') return 'warning.main';
  if (tone === 'time' || tone === 'success') return 'success.main';
  if (tone === 'calm') return 'primary.main';
  return 'text.secondary';
}

/** Compact multi-line preview for insight cards that don’t suit a mini chart. */
export default function InsightListPreview({
  items,
  emptyLabel = 'Nothing to show',
}: InsightListPreviewProps) {
  if (items.length === 0) {
    return (
      <PreviewRoot className="insight-list-preview">
        <Typography variant="caption" color="text.secondary">
          {emptyLabel}
        </Typography>
      </PreviewRoot>
    );
  }

  return (
    <PreviewRoot className="insight-list-preview">
      {items.map((item) => {
        const accent = accentColor(item.tone);
        const secondary = item.secondary ? (
          <Typography
            variant="caption"
            color={accent}
            noWrap
            fontWeight={item.tone && item.tone !== 'default' ? 600 : 400}
            sx={{ flexShrink: 0, maxWidth: '42%' }}
          >
            {item.secondary}
          </Typography>
        ) : null;

        const primaryNode = item.href ? (
          <Link
            component={NextLink}
            href={item.href as Route}
            underline="hover"
            color="inherit"
            variant="body2"
            noWrap
            onClick={(event) => event.stopPropagation()}
            sx={{ minWidth: 0, flex: 1, fontWeight: 600 }}
          >
            {item.primary}
          </Link>
        ) : (
          <Typography
            variant="body2"
            noWrap
            sx={{ minWidth: 0, flex: 1, fontWeight: 500 }}
          >
            {item.primary}
          </Typography>
        );

        const row = (
          <PreviewRow key={item.id}>
            {primaryNode}
            {secondary}
          </PreviewRow>
        );

        if (!item.tooltip) return row;

        return (
          <Tooltip key={item.id} title={item.tooltip} enterDelay={400} placement="top">
            {row}
          </Tooltip>
        );
      })}
    </PreviewRoot>
  );
}
