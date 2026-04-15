'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const ContentColumn = styled(Box)(({ theme }) => ({
    paddingTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
}));

export const QuestionPreviewBox = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(1),
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.action.hover,
    borderRadius: Number(theme.shape.borderRadius),
}));
