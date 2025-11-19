'use client';

import React, { forwardRef } from 'react';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import { Box, Typography } from '@mui/material';
import { NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react';
import {
    PDF_NOTE_CHIP_MUI_CLASSNAMES,
    PDF_NOTE_LINK_ATTRIBUTE,
    PDF_NOTE_LINK_SALT,
    PDF_NOTE_SENTINEL_ATTRIBUTE,
    buildPdfNoteSentinelText,
    formatPdfNoteTimestamp,
    getPdfNoteLinkPalette,
} from '@/app/_lib/utils/pdfNoteLinks';

type PdfAttrs = Record<string, string | number | null | undefined>;

type InlineSegment = {
    key: string;
    text?: string | null;
    sx?: Record<string, unknown>;
};

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
    const encodedPayload =
        typeof attrs['data-pdf-payload'] === 'string' ? attrs['data-pdf-payload'] : null;
    const sentinelText = encodedPayload ? buildPdfNoteSentinelText(encodedPayload) : null;

    const inlineSegments: InlineSegment[] = [
        {
            key: 'chip',
            text: label,
            sx: { fontWeight: 600 },
        },
        {
            key: 'page',
            text: pageLabel,
            sx: { fontWeight: 500, opacity: 0.9 },
        },
    ];

    if (snippetText) {
        inlineSegments.push({
            key: 'snippet',
            text: snippetText,
            sx: { opacity: 0.75, fontSize: '0.9rem' },
        });
    }

    const inlineTypography = inlineSegments
        .filter((segment) => segment.text && `${segment.text}`.trim().length > 0)
        .flatMap((segment, index) => {
            const fragments: React.ReactNode[] = [];

            if (index > 0) {
                fragments.push(
                    <Typography
                        key={`sep-${segment.key}`}
                        component="span"
                        fontSize="0.8rem"
                        aria-hidden
                        sx={{ opacity: 0.6 }}
                    >
                        •
                    </Typography>
                );
            }

            fragments.push(
                <Typography
                    key={`seg-${segment.key}`}
                    component="span"
                    color={palette.muted}
                    sx={segment.sx}
                >
                    {segment.text}
                </Typography>
            );

            return fragments;
        });

    return (
        <NodeViewWrapper
            ref={ref}
            as="span"
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
                display: 'block',
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
                    flexWrap: 'wrap',
                }}
            >
                <Box
                    component="span"
                    aria-hidden={true}
                    sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '999px',
                        backgroundColor: palette.accent,
                        boxShadow: `0 0 0 4px ${palette.halo}33`,
                        flexShrink: 0,
                    }}
                />
                <Box
                    component="span"
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                        rowGap: 0.5,
                        alignItems: 'center',
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    {inlineTypography}
                </Box>
                <Box
                    component="span"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: 1,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: palette.muted,
                        mt: 1,
                    }}
                >
                    <LinkRoundedIcon sx={{ fontSize: 16, color: palette.muted }} />
                    <Typography component="span" fontSize="0.75rem">
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
            {sentinelText ? (
                <span
                    {...{ [PDF_NOTE_SENTINEL_ATTRIBUTE]: 'true' }}
                    data-link-id={attrs['data-link-id'] ?? undefined}
                    aria-hidden={true}
                    hidden
                    style={{
                        display: 'none',
                        visibility: 'hidden',
                        width: 0,
                        height: 0,
                        overflow: 'hidden',
                        padding: 0,
                        margin: 0,
                    }}
                >
                    {sentinelText}
                </span>
            ) : null}

        </NodeViewWrapper>
    );
});

PdfNoteChipNodeView.displayName = 'PdfNoteChipNodeView';

export default PdfNoteChipNodeView;
