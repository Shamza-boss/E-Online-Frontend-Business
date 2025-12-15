'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { pdfjs } from 'react-pdf';
import NextImage from '@/app/_lib/components/shared-theme/NextImage';

interface PDFThumbnailsProps {
    pdfDocument: any;
    numPages: number;
    currentPage: number;
    onPageClick: (pageNumber: number) => void;
}

const PDFThumbnails: React.FC<PDFThumbnailsProps> = ({
    pdfDocument,
    numPages,
    currentPage,
    onPageClick,
}) => {
    const [thumbnails, setThumbnails] = useState<Record<number, string>>({});
    const [loadingPages, setLoadingPages] = useState<Set<number>>(new Set());
    const currentThumbnailRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!pdfDocument || numPages === 0) return;

        const generateThumbnail = async (pageNum: number) => {
            if (thumbnails[pageNum] || loadingPages.has(pageNum)) return;

            setLoadingPages((prev) => new Set(prev).add(pageNum));

            try {
                const page = await pdfDocument.getPage(pageNum);
                const viewport = page.getViewport({ scale: 1.0 }); // Full resolution (100%)

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d', {
                    alpha: false,
                    willReadFrequently: false
                });

                if (!context) {
                    setLoadingPages((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(pageNum);
                        return newSet;
                    });
                    return;
                }

                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({
                    canvasContext: context,
                    viewport: viewport,
                }).promise;

                const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.92); // Higher quality JPEG at 92%

                setThumbnails((prev) => ({
                    ...prev,
                    [pageNum]: thumbnailUrl,
                }));

                // Clean up
                page.cleanup();
            } catch (error) {
                console.error(`Error generating thumbnail for page ${pageNum}:`, error);
            } finally {
                setLoadingPages((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(pageNum);
                    return newSet;
                });
            }
        };

        // Generate thumbnails for current page and nearby pages first
        const pagesToLoad: number[] = [];
        const range = 2; // Reduced from 3 to 2 pages before and after

        for (let i = Math.max(1, currentPage - range); i <= Math.min(numPages, currentPage + range); i++) {
            pagesToLoad.push(i);
        }

        // Then add remaining pages
        for (let i = 1; i <= numPages; i++) {
            if (!pagesToLoad.includes(i)) {
                pagesToLoad.push(i);
            }
        }

        // Load thumbnails progressively with batching
        const loadThumbnails = async () => {
            const batchSize = 2; // Process 2 thumbnails at a time
            for (let i = 0; i < pagesToLoad.length; i += batchSize) {
                const batch = pagesToLoad.slice(i, i + batchSize);
                await Promise.all(
                    batch.map(pageNum => {
                        if (!thumbnails[pageNum] && !loadingPages.has(pageNum)) {
                            return generateThumbnail(pageNum);
                        }
                        return Promise.resolve();
                    })
                );
                // Delay between batches to prevent UI blocking
                if (i + batchSize < pagesToLoad.length) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }
        };

        loadThumbnails();
    }, [pdfDocument, numPages, currentPage]);

    // Scroll current thumbnail into view
    useEffect(() => {
        if (currentThumbnailRef.current && containerRef.current) {
            const container = containerRef.current;
            const thumbnail = currentThumbnailRef.current;

            const containerRect = container.getBoundingClientRect();
            const thumbnailRect = thumbnail.getBoundingClientRect();

            if (
                thumbnailRect.top < containerRect.top ||
                thumbnailRect.bottom > containerRect.bottom
            ) {
                thumbnail.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [currentPage]);

    if (!pdfDocument || numPages === 0) {
        return (
            <Box p={2} display="flex" justifyContent="center">
                <CircularProgress size={24} />
            </Box>
        );
    }

    return (
        <Box
            ref={containerRef}
            sx={{
                height: '100%',
                width: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
                p: 1.5,
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: (theme) => theme.palette.divider,
                    borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    background: (theme) => theme.palette.action.hover,
                },
            }}
        >
            <Box display="flex" flexDirection="column" gap={1.5}>
                {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => {
                    const isCurrentPage = pageNum === currentPage;
                    const thumbnail = thumbnails[pageNum];
                    const isLoading = loadingPages.has(pageNum);

                    return (
                        <Paper
                            key={pageNum}
                            ref={isCurrentPage ? currentThumbnailRef : null}
                            elevation={isCurrentPage ? 4 : 1}
                            sx={{
                                cursor: 'pointer',
                                transition: 'all 0.2s ease-in-out',
                                border: '2px solid',
                                borderColor: isCurrentPage ? 'primary.main' : 'transparent',
                                overflow: 'hidden',
                                '&:hover': {
                                    borderColor: isCurrentPage ? 'primary.main' : 'primary.light',
                                    transform: 'scale(1.02)',
                                    elevation: 3,
                                },
                            }}
                            onClick={() => onPageClick(pageNum)}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    aspectRatio: '1 / 1.414', // A4 aspect ratio
                                    backgroundColor: 'background.default',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {isLoading && !thumbnail ? (
                                    <CircularProgress size={20} />
                                ) : thumbnail ? (
                                    <NextImage
                                        src={thumbnail}
                                        alt={`Page ${pageNum}`}
                                        width={300}
                                        height={424}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                        }}
                                        unoptimized
                                    />
                                ) : (
                                    <Typography variant="caption" color="text.secondary">
                                        Page {pageNum}
                                    </Typography>
                                )}
                            </Box>
                            <Box
                                sx={{
                                    p: 0.75,
                                    backgroundColor: isCurrentPage
                                        ? 'primary.main'
                                        : 'background.paper',
                                    borderTop: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    align="center"
                                    sx={{
                                        display: 'block',
                                        fontWeight: isCurrentPage ? 600 : 400,
                                        color: isCurrentPage ? 'primary.contrastText' : 'text.secondary',
                                    }}
                                >
                                    Page {pageNum}
                                </Typography>
                            </Box>
                        </Paper>
                    );
                })}
            </Box>
        </Box>
    );
};

export default PDFThumbnails;
