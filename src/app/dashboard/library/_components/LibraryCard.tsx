'use client';

import { memo, useCallback } from 'react';
import {
    Box,
    Chip,
    Skeleton,
    Typography,
    Tooltip,
    Stack,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import StorageIcon from '@mui/icons-material/Storage';
import BusinessIcon from '@mui/icons-material/Business';
import { FileDto } from '@/app/_lib/interfaces/types';
import {
    StyledCard,
    StyledCardContent,
} from '@/app/_lib/components/website/components/styled/StyledComponents';

interface LibraryCardProps {
    file: FileDto;
    thumbnail?: string;
    isLoadingThumbnail: boolean;
    onPreview: (file: FileDto) => void;
}

const extractName = (fileKey: string) => {
    return fileKey.split('_').pop() ?? fileKey;
};

// Format file size to human readable
const formatFileSize = (bytes: number | null | undefined): string => {
    if (bytes == null) return 'Unknown size';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

// Gentle accent color for library/document cards
const libraryAccent = '#3B82F6';

function LibraryCard({
    file,
    thumbnail,
    isLoadingThumbnail,
    onPreview,
}: LibraryCardProps) {
    const handlePreview = useCallback(() => {
        onPreview(file);
    }, [file, onPreview]);

    return (
        <StyledCard 
            variant="outlined" 
            tabIndex={0}
            onClick={handlePreview}
            sx={{
                borderWidth: 1.5,
                borderColor: alpha(libraryAccent, 0.15),
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    borderColor: alpha(libraryAccent, 0.4),
                    backgroundColor: alpha(libraryAccent, 0.02),
                    boxShadow: `0 4px 20px ${alpha(libraryAccent, 0.1)}`,
                    transform: 'translateY(-3px)',
                },
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box
                    sx={{
                        width: '100%',
                        aspectRatio: '16 / 9',
                        borderBottom: '1px solid',
                        borderColor: alpha(libraryAccent, 0.1),
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        overflow: 'hidden',
                        position: 'relative',
                        background: isLoadingThumbnail || !thumbnail 
                            ? `linear-gradient(135deg, ${alpha(libraryAccent, 0.05)} 0%, ${alpha('#8B5CF6', 0.05)} 100%)`
                            : 'transparent',
                    }}
                >
                    {isLoadingThumbnail || !thumbnail ? (
                        <>
                            <Skeleton
                                variant="rectangular"
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    bgcolor: alpha(libraryAccent, 0.08),
                                }}
                                animation="wave"
                            />
                            {/* PDF icon placeholder while loading */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: '50%',
                                        background: alpha(libraryAccent, 0.1),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <PictureAsPdfIcon 
                                        sx={{ 
                                            fontSize: 40, 
                                            color: alpha(libraryAccent, 0.4),
                                        }} 
                                    />
                                </Box>
                            </Box>
                        </>
                    ) : (
                        <Box
                            component="img"
                            alt={`${extractName(file.fileKey)} preview`}
                            src={thumbnail}
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                },
                            }}
                        />
                    )}
                </Box>
                <StyledCardContent sx={{ padding: 2, flexGrow: 1 }}>
                    <Tooltip title={file.fileName || extractName(file.fileKey)} placement="top">
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                pr: 1, 
                                minWidth: 0,
                                fontSize: '1rem',
                                fontWeight: 600,
                            }} 
                            noWrap
                        >
                            {file.fileName || extractName(file.fileKey)}
                        </Typography>
                    </Tooltip>
                    
                    {/* Metadata row */}
                    <Stack 
                        direction="row" 
                        spacing={1.5} 
                        alignItems="center" 
                        sx={{ mt: 0.5 }}
                        flexWrap="wrap"
                    >
                        <Tooltip title="File size">
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <StorageIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                                <Typography variant="caption" color="text.secondary">
                                    {formatFileSize(file.sizeBytes)}
                                </Typography>
                            </Stack>
                        </Tooltip>
                        <Typography variant="caption" color="text.disabled">•</Typography>
                        <Tooltip title="PDF Document">
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <PictureAsPdfIcon sx={{ fontSize: 14, color: '#E53935' }} />
                                <Typography variant="caption" color="text.secondary">
                                    PDF
                                </Typography>
                            </Stack>
                        </Tooltip>
                    </Stack>
                </StyledCardContent>
                
                {/* Footer with visibility and actions */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 1.5,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px 20px',
                        borderTop: '1px solid',
                        borderColor: alpha(libraryAccent, 0.08),
                    }}
                >
                    <Tooltip 
                        title={file.isPublic 
                            ? 'Visible to all trainees in your organization' 
                            : 'Only accessible by instructors and admins'
                        }
                        placement="top"
                    >
                        <Chip
                            size="small"
                            label={file.isPublic ? 'Public' : 'Private'}
                            icon={file.isPublic ? <PublicIcon /> : <LockIcon />}
                            sx={{
                                bgcolor: file.isPublic 
                                    ? alpha('#10B981', 0.1) 
                                    : alpha('#6B7280', 0.1),
                                color: file.isPublic ? '#10B981' : '#6B7280',
                                fontWeight: 500,
                                '& .MuiChip-icon': {
                                    color: 'inherit',
                                },
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Open document viewer">
                        <Chip
                            size="small"
                            icon={<VisibilityIcon />}
                            label="View"
                            sx={{
                                bgcolor: alpha(libraryAccent, 0.1),
                                color: libraryAccent,
                                fontWeight: 500,
                                '& .MuiChip-icon': {
                                    color: 'inherit',
                                },
                            }}
                        />
                    </Tooltip>
                </Box>
            </Box>
        </StyledCard>
    );
}

export default memo(LibraryCard);