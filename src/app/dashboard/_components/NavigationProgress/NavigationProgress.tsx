'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { LinearProgress } from '@mui/material';
import { PROGRESS_DELAY_MS, PROGRESS_DURATION_MS, PROGRESS_HEIGHT } from './constants';
import { ProgressContainer } from './elements';

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setShowProgress(true);
    }, PROGRESS_DELAY_MS);

    const endTimer = setTimeout(() => {
      setShowProgress(false);
    }, PROGRESS_DURATION_MS);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, [pathname, searchParams]);

  if (!showProgress) {
    return null;
  }

  return (
    <ProgressContainer>
      <LinearProgress
        sx={{
          height: PROGRESS_HEIGHT,
          backgroundColor: 'transparent',
          '& .MuiLinearProgress-bar': {
            transition: 'transform 0.2s linear',
          },
        }}
      />
    </ProgressContainer>
  );
}
