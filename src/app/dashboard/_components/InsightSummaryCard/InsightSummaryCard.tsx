'use client';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import type { InsightSummaryCardProps } from './types';
import { SummaryCardRoot, ChartSlot, OpenCue, ValueBlock } from './elements';

export default function InsightSummaryCard({
  title,
  value,
  valueHint,
  subtitle,
  onOpen,
  children,
}: InsightSummaryCardProps) {
  return (
    <SummaryCardRoot
      elevation={0}
      variant="outlined"
      role="button"
      tabIndex={0}
      aria-label={`Open ${title} details`}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen();
        }
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        sx={{ mb: 0.5 }}
      >
        <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ minWidth: 0 }}>
          {title}
        </Typography>
        <OpenCue>
          <OpenInFullIcon fontSize="inherit" />
        </OpenCue>
      </Stack>
      {subtitle ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 0.5, display: 'block' }}
        >
          {subtitle}
        </Typography>
      ) : null}
      {value != null ? (
        <ValueBlock>
          <Typography
            variant="h4"
            fontWeight={700}
            lineHeight={1.1}
            color="primary.main"
            sx={{ letterSpacing: '-0.02em' }}
          >
            {value}
          </Typography>
          {valueHint ? (
            <Typography variant="caption" color="text.secondary" noWrap>
              {valueHint}
            </Typography>
          ) : null}
        </ValueBlock>
      ) : null}
      <ChartSlot>{children}</ChartSlot>
    </SummaryCardRoot>
  );
}
