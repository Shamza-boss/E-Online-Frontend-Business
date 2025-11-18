'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { LinearProgress, Box } from '@mui/material';

/**
 * Navigation progress bar component
 * Shows a loading indicator at the top of the page during:
 * - Route transitions
 * - Next.js compilation
 * - Page loads
 */
export default function NavigationProgress() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isNavigating, setIsNavigating] = useState(false);
    const [showProgress, setShowProgress] = useState(false);

    useEffect(() => {
        // Start loading when navigation begins
        setIsNavigating(true);

        // Small delay to prevent flash for instant navigations
        const startTimer = setTimeout(() => {
            if (isNavigating) {
                setShowProgress(true);
            }
        }, 150);

        // Reset loading state after navigation completes
        // Extended timeout to account for Next.js compilation
        const endTimer = setTimeout(() => {
            setIsNavigating(false);
            setShowProgress(false);
        }, 800);

        return () => {
            clearTimeout(startTimer);
            clearTimeout(endTimer);
        };
    }, [pathname, searchParams]);

    // Also reset on unmount
    useEffect(() => {
        return () => {
            setIsNavigating(false);
            setShowProgress(false);
        };
    }, []);

    if (!showProgress) return null;

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
            }}
        >
            <LinearProgress
                sx={{
                    height: 3,
                    backgroundColor: 'transparent',
                    '& .MuiLinearProgress-bar': {
                        transition: 'transform 0.2s linear',
                    },
                }}
            />
        </Box>
    );
}
