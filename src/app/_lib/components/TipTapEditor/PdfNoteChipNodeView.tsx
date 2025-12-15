'use client';

import React, { forwardRef } from 'react';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { Box, Typography } from '@mui/material';
import { NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react';
import {
    PDF_NOTE_CHIP_MUI_CLASSNAMES,
    PDF_NOTE_LINK_ATTRIBUTE,
    PDF_NOTE_LINK_SALT,
    formatPdfNoteTimestamp,
    getPdfNoteLinkPalette,
} from '@/app/_lib/utils/pdfNoteLinks';

type PdfAttrs = Record<string, string | number | null | undefined>;

const buildChipLabel = (options: PdfAttrs) => {
    const chipAttr = options['data-chip-label'];
    if (chipAttr && typeof chipAttr === 'string') {
        return chipAttr;
    }

    const outline = (options['data-outline-title'] as string | undefined)?.trim();
    if (outline) {
        return `See ${outline}`;
    }

    const pageNumber = options['data-page-number'];
    if (pageNumber) {
        return `Open on Page ${pageNumber}`;
    }

    return `Open ${options['data-label'] ?? 'PDF'}`;
};

const PdfNoteChipNodeView = forwardRef<
    HTMLSpanElement,
    ReactNodeViewProps<HTMLSpanElement>
>(({ node }, ref) => {
    const attrs = node.attrs as PdfAttrs;
    const label = buildChipLabel(attrs);
    const pageLabel = (attrs['data-label'] as string) ?? 'Page';
    const pageNumber = attrs['data-page-number'];
    const titleText =
        (attrs.title as string | undefined) ??
        (pageNumber
            ? `Jump to ${pageLabel} (Page ${pageNumber})`
            : `Jump to ${pageLabel}`);
    const ariaLabel =
        (attrs['aria-label'] as string | undefined) ?? `PDF link to ${pageLabel}`;
    const bookmarkColor = (attrs['data-chip-color'] as string | undefined) || undefined;
    const palette = getPdfNoteLinkPalette(bookmarkColor);
    const timestamp =
        formatPdfNoteTimestamp(attrs['data-created-at'] as string | undefined) ||
        'Recently linked';
    const rawTabIndex = attrs.tabindex;
    const tabIndex =
        typeof rawTabIndex === 'number'
            ? rawTabIndex
            : Number.isFinite(Number(rawTabIndex))
                ? Number(rawTabIndex)
                : 0;

    const snippetText =
        typeof attrs['data-snippet'] === 'string' && attrs['data-snippet'].trim().length > 0
            ? attrs['data-snippet']
            : undefined;
    return (
        <NodeViewWrapper
            ref={ref}
            as="div"
            role={node.attrs.role ?? 'button'}
            tabIndex={tabIndex}
            className={PDF_NOTE_CHIP_MUI_CLASSNAMES}
            draggable={false}
            contentEditable={false}
            {...{
                [PDF_NOTE_LINK_ATTRIBUTE]: 'true',
                'data-pdf-salt': attrs['data-pdf-salt'] ?? PDF_NOTE_LINK_SALT,
                'data-pdf-payload': attrs['data-pdf-payload'] ?? undefined,
                'data-pdf-checksum': attrs['data-pdf-checksum'] ?? undefined,
                'data-link-id': attrs['data-link-id'] ?? undefined,
                'data-page-number': pageNumber ?? undefined,
                'data-label': pageLabel,
                'data-outline-title': attrs['data-outline-title'] ?? undefined,
                'data-file-url': attrs['data-file-url'] ?? undefined,
                'data-snippet': attrs['data-snippet'] ?? undefined,
                'data-created-at': attrs['data-created-at'] ?? undefined,
                'data-chip-label': label,
                'data-chip-color': palette.accent,
                title: titleText,
                'aria-label': ariaLabel,
            }}
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                boxSizing: 'border-box',
                cursor: 'pointer',
                userSelect: 'none',
                margin: '12px 0',
                padding: '8px 0',
                borderRadius: 0,
                background: 'transparent',
                border: 'none',
                color: palette.muted,
            }}
        >
            <Box
                component="span"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                }}
            >
                <BookmarkIcon
                    sx={{
                        fontSize: 16,
                        color: palette.accent,
                        flexShrink: 0,
                    }}
                />
                <Box
                    component="span"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    <Typography
                        component="span"
                        color={palette.muted}
                        fontWeight={600}
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                            flexWrap: 'wrap',
                        }}
                    >
                        {label}
                        <Typography
                            component="span"
                            fontSize="0.8rem"
                            sx={{ opacity: 0.75, fontWeight: 500 }}
                        >
                            {pageNumber ? ` · Page ${pageNumber}` : null}
                        </Typography>
                    </Typography>
                    {snippetText ? (
                        <Typography
                            component="span"
                            color={palette.muted}
                            fontSize="0.85rem"
                            sx={{ opacity: 0.75 }}
                        >
                            {snippetText}
                        </Typography>
                    ) : null}
                </Box>
                <Box
                    component="span"
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        color: palette.muted,
                    }}
                >
                    <LinkRoundedIcon sx={{ fontSize: 16, color: palette.muted }} />
                    <Typography component="span" fontSize="0.7rem">
                        {timestamp}
                    </Typography>
                </Box>
            </Box>
            <Box
                component="span"
                aria-hidden={true}
                sx={{
                    display: 'block',
                    borderBottom: `1px solid ${palette.border}`,
                    mt: 1.5,
                }}
            />
        </NodeViewWrapper>
    );
});

PdfNoteChipNodeView.displayName = 'PdfNoteChipNodeView';

export default PdfNoteChipNodeView;
