'use client';

import React, { useId, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { PageIntroProps } from './types';
import { DEFAULT_INFO_ARIA_LABEL, DEFAULT_TITLE_VARIANT } from './constants';
import { CompactBar, DesktopIntro, InfoBody, IntroRoot } from './elements';

function Eyebrow({ children }: { children: React.ReactNode }) {
  if (typeof children === 'string' || typeof children === 'number') {
    return (
      <Typography
        variant="overline"
        fontWeight={700}
        letterSpacing={1.5}
        sx={{ display: 'block', color: 'text.secondary' }}
      >
        {children}
      </Typography>
    );
  }
  return <>{children}</>;
}

export default function PageIntro({
  title,
  eyebrow,
  description,
  icon,
  actions,
  children,
  titleVariant = DEFAULT_TITLE_VARIANT,
  collapseBelow = 'md',
  infoAriaLabel = DEFAULT_INFO_ARIA_LABEL,
}: PageIntroProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const titleId = useId();
  const infoOpen = Boolean(anchorEl);

  const hasReferenceContent = Boolean(title || eyebrow || description || children);

  const titleBlock = (icon || eyebrow || title) && (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
      {icon}
      <Box sx={{ minWidth: 0 }}>
        {eyebrow != null && eyebrow !== false && <Eyebrow>{eyebrow}</Eyebrow>}
        {title && (
          <Typography
            id={titleId}
            variant={titleVariant}
            fontWeight={600}
            lineHeight={1.3}
          >
            {title}
          </Typography>
        )}
      </Box>
    </Stack>
  );

  const referenceContent = (
    <InfoBody>
      {titleBlock}
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          {description}
        </Typography>
      )}
      {children}
    </InfoBody>
  );

  return (
    <IntroRoot>
      <DesktopIntro $collapseBelow={collapseBelow}>
        {(titleBlock || actions) && (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            sx={{ mb: description || children ? 2 : 0 }}
          >
            {titleBlock}
            {actions && (
              <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                {actions}
              </Stack>
            )}
          </Stack>
        )}

        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: children ? 2 : 0, maxWidth: 720, lineHeight: 1.6 }}
          >
            {description}
          </Typography>
        )}

        {children}
      </DesktopIntro>

      <CompactBar $collapseBelow={collapseBelow}>
        {(actions || hasReferenceContent) && (
          <>
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.5,
                alignItems: 'center',
              }}
            >
              {actions}
            </Box>
            {hasReferenceContent && (
              <Tooltip title={infoAriaLabel}>
                <IconButton
                  size="small"
                  color="primary"
                  aria-label={infoAriaLabel}
                  aria-haspopup="dialog"
                  aria-expanded={infoOpen}
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                >
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
      </CompactBar>

      <Popover
        open={infoOpen}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              maxWidth: 360,
              p: 2,
              mt: 0.5,
            },
          },
        }}
      >
        {referenceContent}
      </Popover>
    </IntroRoot>
  );
}
