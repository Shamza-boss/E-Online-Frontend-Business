import React from 'react';
import { Box, Chip, IconButton, List, ListItem, ListItemButton, Typography, Tooltip, ListItemText, Divider } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import EditIcon from '@mui/icons-material/Edit';
import ArticleIcon from '@mui/icons-material/Article';
import type { PdfNoteLinkSummary } from '@/app/_lib/utils/pdfNoteLinks';
import { Bookmark } from '@mui/icons-material';

interface PDFNoteLinksProps {
    links: PdfNoteLinkSummary[];
    onSelect?: (link: PdfNoteLinkSummary) => void;
    onOpenNote?: (link: PdfNoteLinkSummary) => void;
    activeLinkId?: string | null;
    onEditBookmark?: (link: PdfNoteLinkSummary) => void;
}

const EmptyState = () => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            px: 2,
            py: 6,
            color: 'text.secondary',
            gap: 1,
        }}
    >
        <ArticleIcon color="disabled" />
        <Typography variant="body2">
            No note links yet. Create one from the PDF toolbar.
        </Typography>
    </Box>
);

const PDFNoteLinks: React.FC<PDFNoteLinksProps> = ({
    links,
    onSelect,
    onOpenNote,
    activeLinkId,
    onEditBookmark,
}) => {
    if (!links?.length) {
        return <EmptyState />;
    }

    return (
        <List
            dense
            sx={{
                overflowY: 'auto',
                height: '100%',
                '&::-webkit-scrollbar': {
                    width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'divider',
                    borderRadius: '3px',
                },
            }}
        >
            {links.map((link) => {
                const isActive = activeLinkId === link.id;
                return (
                    <ListItem key={link.id} disablePadding secondaryAction={
                        onEditBookmark ? (
                            <Tooltip title="Edit bookmark">
                                <IconButton
                                    edge="end"
                                    size="small"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        onEditBookmark(link);
                                    }}
                                >
                                    <EditIcon fontSize="inherit" />
                                </IconButton>
                            </Tooltip>
                        ) : undefined
                    }>
                        <ListItemButton
                            selected={isActive}
                            onClick={() => {
                                onOpenNote?.(link);
                                onSelect?.(link);
                            }}
                            title={`Jump to ${formatLinkLabel(link)} (Page ${link.pageNumber})`}
                            sx={{
                                borderLeft: (theme) =>
                                    `3px solid ${isActive ? theme.palette.success.main : 'transparent'}`,
                                alignItems: 'center',
                            }}
                        >
                            <ListItemText primary={formatLinkLabel(link)} secondary={formatLinkDateTime(link.createdAt)} />
                            <Chip
                                size="small"
                                label={`Page ${link.pageNumber}`}
                                icon={<Bookmark fontSize="inherit" />}
                                variant="outlined"
                                sx={{
                                    mr: 1,
                                    borderColor: link.bookmarkColor || 'primary.main',
                                    color: link.bookmarkColor || 'primary.main',
                                    '& .MuiChip-icon': {
                                        color: link.bookmarkColor || 'primary.main',
                                    },
                                }}
                            />
                            <Divider orientation="vertical" flexItem />
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
};

export const formatLinkDateTime = (value?: string | null) => {
    if (!value) {
        return '';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return value;
    }

    try {
        return new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(parsed);
    } catch {
        return parsed.toLocaleString('en-US');
    }
};

const formatLinkLabel = (link: PdfNoteLinkSummary) => {
    const custom = link.bookmarkTitle?.trim();
    if (custom) {
        return `${custom}`;
    }
    const outline = link.outlineTitle?.trim();
    if (outline) {
        return `See ${outline}`;
    }
    return `Open on Page ${link.pageNumber}`;
};

export default React.memo(PDFNoteLinks);
