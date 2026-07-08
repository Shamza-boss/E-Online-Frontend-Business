'use client';

import { useSearchParams } from 'next/navigation';
import { Typography, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { useState, useCallback } from 'react';
import {
  REFERENCE_PARAM,
  COPY_RESET_MS,
  REFERENCE_LABEL,
  COPY_TOOLTIP,
  COPIED_TOOLTIP,
} from './constants';
import { ReferenceContainer, ReferenceCode } from './elements';

export default function ErrorRefClient() {
  const searchParams = useSearchParams();
  const ref = searchParams.get(REFERENCE_PARAM);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!ref) {
      return;
    }

    await navigator.clipboard.writeText(ref);
    setCopied(true);
    setTimeout(() => setCopied(false), COPY_RESET_MS);
  }, [ref]);

  if (!ref) {
    return null;
  }

  return (
    <ReferenceContainer>
      <Typography variant="body2" color="text.secondary">
        {REFERENCE_LABEL}
      </Typography>
      <ReferenceCode variant="body2">{ref}</ReferenceCode>
      <Tooltip title={copied ? COPIED_TOOLTIP : COPY_TOOLTIP}>
        <IconButton size="small" onClick={handleCopy}>
          {copied ? (
            <CheckIcon fontSize="small" color="success" />
          ) : (
            <ContentCopyIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>
    </ReferenceContainer>
  );
}
