"use client";

import * as React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import type { ButtonProps } from '@mui/material/Button';
import type { SxProps, Theme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';

interface ProcessingButtonProps extends ButtonProps {
    loading?: boolean;
    success?: boolean;
    showIcon?: boolean;
}

export function ProcessingButton({
    loading = false,
    success = false,
    showIcon = false,
    children,
    sx,
    disabled,
    ...buttonProps
}: ProcessingButtonProps) {
    const successStyles = success
        ? {
            bgcolor: green[500],
            '&:hover': {
                bgcolor: green[700],
            },
        }
        : undefined;

    const combinedSx = React.useMemo<SxProps<Theme> | undefined>(() => {
        if (!successStyles) return sx;
        if (Array.isArray(sx)) {
            return [successStyles, ...sx];
        }
        return sx ? [successStyles, sx] : [successStyles];
    }, [successStyles, sx]);

    return (
        <Box sx={{ m: 0, position: 'relative', display: 'inline-flex' }}>
            <Button
                {...buttonProps}
                disabled={loading || disabled}
                sx={combinedSx}
            >
                {children}
            </Button>
            {loading && (
                <CircularProgress
                    size={24}
                    sx={{
                        color: green[500],
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                    }}
                />
            )}
        </Box>
    );
}
