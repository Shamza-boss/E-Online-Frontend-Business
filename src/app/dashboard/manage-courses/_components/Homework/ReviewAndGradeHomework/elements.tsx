'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

export const ContentPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    margin: theme.spacing(2),
}));

export const PdfPreviewBox = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
    height: 360,
    borderRadius: Number(theme.shape.borderRadius),
    overflow: 'hidden',
    border: `1px solid ${theme.palette.divider}`,
}));

export const PdfFallbackBox = styled(Box)({
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingInline: 16,
});

export const QuestionBlock = styled(Box, {
    shouldForwardProp: (prop) => prop !== '$indent',
})<{ $indent?: number }>(({ theme, $indent = 0 }) => ({
    marginBlock: theme.spacing(2),
    marginLeft: theme.spacing($indent),
}));

export const AnswerSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(1),
}));

export const GradingBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== '$borderColor',
})<{ $borderColor?: string }>(({ theme, $borderColor = 'transparent' }) => ({
    border: `2px solid ${$borderColor}`,
    borderRadius: Number(theme.shape.borderRadius) * 2,
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
}));
