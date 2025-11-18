import React from 'react';
import { Box, Skeleton, Stack, Paper } from '@mui/material';

/**
 * Generic page skeleton loader for dashboard pages
 * Shows a full-page loading state with header and content areas
 */
export default function PageSkeleton() {
    return (
        <Box sx={{ width: '100%', height: '100%', p: 3 }}>
            <Stack spacing={3}>
                {/* Page Header */}
                <Box>
                    <Skeleton
                        variant="text"
                        width="30%"
                        height={40}
                        sx={{ mb: 1 }}
                    />
                    <Skeleton
                        variant="text"
                        width="50%"
                        height={24}
                    />
                </Box>

                {/* Action Bar / Toolbar */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Skeleton variant="rounded" width={120} height={40} />
                    <Skeleton variant="rounded" width={100} height={40} />
                    <Box sx={{ flex: 1 }} />
                    <Skeleton variant="rounded" width={200} height={40} />
                </Box>

                {/* Main Content Area */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Stack spacing={2}>
                        {/* Content rows */}
                        {[...Array(5)].map((_, idx) => (
                            <Box
                                key={idx}
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                    alignItems: 'center',
                                    pb: 2,
                                    borderBottom: idx < 4 ? '1px solid' : 'none',
                                    borderColor: 'divider'
                                }}
                            >
                                <Skeleton variant="circular" width={40} height={40} />
                                <Box sx={{ flex: 1 }}>
                                    <Skeleton variant="text" width="60%" height={24} />
                                    <Skeleton variant="text" width="40%" height={20} />
                                </Box>
                                <Skeleton variant="rounded" width={80} height={32} />
                            </Box>
                        ))}
                    </Stack>
                </Paper>

                {/* Additional content sections */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            flex: 1,
                            p: 2,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        <Skeleton variant="rectangular" height={200} />
                    </Paper>
                    <Paper
                        elevation={0}
                        sx={{
                            flex: 1,
                            p: 2,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        <Skeleton variant="rectangular" height={200} />
                    </Paper>
                </Box>
            </Stack>
        </Box>
    );
}
