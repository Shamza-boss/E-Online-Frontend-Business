'use client';

import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import type { PreviewTone } from './types';
import { getToneStyle } from './utils';

export const EmptyPreviewPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: Number(theme.shape.borderRadius) * 2,
    backgroundColor: alpha(
        theme.palette.text.primary,
        theme.palette.mode === 'dark' ? 0.12 : 0.04,
    ),
}));

export const IntroPaper = styled(Paper)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1.5),
    borderRadius: Number(theme.shape.borderRadius) * 2,
    backgroundColor: alpha(
        theme.palette.success.main,
        theme.palette.mode === 'dark' ? 0.2 : 0.08,
    ),
    borderColor: alpha(
        theme.palette.success.main,
        theme.palette.mode === 'dark' ? 0.4 : 0.28,
    ),
}));

export const NodePaper = styled(Paper, {
    shouldForwardProp: (prop) => prop !== '$tone' && prop !== '$indentLevel',
})<{ $tone: PreviewTone; $indentLevel: number }>(({ theme, $tone, $indentLevel }) => {
    const toneStyle = getToneStyle(theme, $tone);
    return {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        marginInlineStart: theme.spacing($indentLevel),
        borderRadius: Number(theme.shape.borderRadius) * 2,
        borderColor: toneStyle.borderColor,
        borderLeft: `6px solid ${toneStyle.borderColor}`,
        backgroundColor: toneStyle.backgroundColor,
        padding: theme.spacing(2),
    };
});

export const HeaderMeta = styled(Stack)(({ theme }) => ({
    marginBottom: theme.spacing(1.5),
}));

export const PromptRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    alignItems: 'baseline',
}));

export const PromptColumn = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
}));

export const ToneChip = styled(Chip, {
    shouldForwardProp: (prop) => prop !== '$tone',
})<{ $tone: PreviewTone }>(({ theme, $tone }) => {
    const toneStyle = getToneStyle(theme, $tone);
    return {
        fontWeight: 600,
        color: toneStyle.accentColor,
        backgroundColor: alpha(
            toneStyle.accentColor,
            theme.palette.mode === 'dark' ? 0.26 : 0.12,
        ),
        borderColor: alpha(
            toneStyle.accentColor,
            theme.palette.mode === 'dark' ? 0.48 : 0.32,
        ),
    };
});

export const QuestionNumber = styled(Typography, {
    shouldForwardProp: (prop) => prop !== '$tone',
})<{ $tone: PreviewTone }>(({ theme, $tone }) => {
    const toneStyle = getToneStyle(theme, $tone);
    return {
        fontWeight: 700,
        color: toneStyle.accentColor,
    };
});

export const PdfContainer = styled(Paper)(({ theme }) => ({
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5),
    borderRadius: Number(theme.shape.borderRadius) * 2,
}));

export const PdfFrame = styled(Box)(({ theme }) => ({
    height: 360,
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    border: `1px solid ${alpha(
        theme.palette.warning.main,
        theme.palette.mode === 'dark' ? 0.55 : 0.35,
    )}`,
    backgroundColor: theme.palette.background.paper,
}));

export const OptionLabel = styled(FormControlLabel, {
    shouldForwardProp: (prop) => prop !== '$selected',
})<{ $selected?: boolean }>(({ theme, $selected }) => {
    const selectedOpacity = theme.palette.mode === 'dark' ? 0.28 : 0.14;
    return {
        margin: 0,
        paddingInline: theme.spacing(1),
        borderRadius: theme.shape.borderRadius,
        backgroundColor: $selected
            ? alpha(theme.palette.success.main, selectedOpacity)
            : 'transparent',
        '& .MuiFormControlLabel-label': {
            fontWeight: $selected ? 600 : undefined,
            color: theme.palette.text.primary,
        },
    };
});

export const CenterFallback = styled(Box)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingInline: theme.spacing(2),
    textAlign: 'center',
}));

export const OptionsColumn = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
});
