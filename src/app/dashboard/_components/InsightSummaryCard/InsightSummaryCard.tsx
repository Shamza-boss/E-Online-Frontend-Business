'use client';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import type { InsightSummaryCardProps } from './types';
import { SummaryCardRoot, ChartSlot, OpenCue, ValueBlock } from './elements';

export default function InsightSummaryCard({
  title,
  value,
  valueHint,
  subtitle,
  onOpen,
  hoverTooltip,
  valueColor = 'primary.main',
  children,
}: InsightSummaryCardProps) {
  const expandable = typeof onOpen === 'function';

  const card = (
    <SummaryCardRoot
      elevation={0}
      variant="outlined"
      role={expandable ? 'button' : undefined}
      tabIndex={expandable ? 0 : undefined}
      aria-label={expandable ? `Open ${title} details` : undefined}
      onClick={expandable ? onOpen : undefined}
      onKeyDown={
        expandable
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onOpen();
              }
            }
          : undefined
      }
      sx={
        expandable
          ? undefined
          : {
              cursor: 'default',
              '&:hover, &:focus-visible': {
                borderColor: 'divider',
                boxShadow: 'none',
                transform: 'none',
              },
            }
      }
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
        {expandable ? (
          <OpenCue>
            <OpenInFullIcon fontSize="inherit" />
          </OpenCue>
        ) : null}
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
            color={valueColor}
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

  if (!hoverTooltip) return card;

  return (
    <Tooltip title={hoverTooltip} enterDelay={450} placement="top" describeChild>
      {card}
    </Tooltip>
  );
}
