'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

export const EmptyStatePaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

export const PlaceholderPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    marginBottom: theme.spacing(2),
    border: '2px dashed',
    borderColor: theme.palette.divider,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default,
}));

export const QuestionPaper = styled(Paper, {
    shouldForwardProp: (prop) =>
        prop !== '$isDragging' && prop !== '$borderColor',
})<{ $isDragging?: boolean; $borderColor: string }>(
    ({ theme, $isDragging, $borderColor }) => ({
        padding: theme.spacing(2),
        marginBottom: 0,
        border: '1px solid',
        borderColor: $isDragging ? theme.palette.primary.main : $borderColor,
        borderLeft: '6px solid',
        borderLeftColor: $isDragging ? theme.palette.primary.main : $borderColor,
        borderRadius: Number(theme.shape.borderRadius) * 2,
        backgroundColor: $isDragging ? theme.palette.background.paper : undefined,
        boxShadow: $isDragging ? theme.shadows[6] : 'none',
    }),
);

export const SubquestionPaper = styled(Paper, {
    shouldForwardProp: (prop) =>
        prop !== '$isDragging' && prop !== '$isDragTarget' && prop !== '$borderColor',
})<{ $isDragging?: boolean; $isDragTarget?: boolean; $borderColor: string }>(
    ({ theme, $isDragging, $isDragTarget, $borderColor }) => {
        const resolvedBorder =
            $isDragTarget || $isDragging ? theme.palette.primary.main : $borderColor;
        return {
            marginBottom: theme.spacing(1),
            marginTop: theme.spacing(1),
            padding: theme.spacing(1.5),
            border: '1px solid',
            borderColor: resolvedBorder,
            borderLeft: '4px solid',
            borderLeftColor: resolvedBorder,
            borderRadius: Number(theme.shape.borderRadius) * 1.5,
            backgroundColor: $isDragging ? theme.palette.background.paper : undefined,
            boxShadow: $isDragging ? theme.shadows[6] : 'none',
            opacity: $isDragging ? 0.92 : 1,
        };
    },
);

export const HeaderBar = styled(Stack, {
    shouldForwardProp: (prop) => prop !== '$isDragging' && prop !== '$headerBg',
})<{ $isDragging?: boolean; $headerBg: string }>(
    ({ theme, $isDragging, $headerBg }) => ({
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: $isDragging ? 'grabbing' : 'grab',
        color: theme.palette.text.primary,
        marginRight: theme.spacing(0.5),
        marginBottom: theme.spacing(1),
        paddingInline: theme.spacing(1),
        paddingBlock: theme.spacing(0.75),
        borderRadius: Number(theme.shape.borderRadius),
        backgroundColor: $headerBg,
        border: `1px solid ${theme.palette.divider}`,
        '&:active': { cursor: 'grabbing' },
    }),
);

export const SubHeaderBar = styled(Stack)(({ theme, ...props }) => ({
    marginBottom: theme.spacing(1),
    paddingInline: theme.spacing(1),
    paddingBlock: theme.spacing(0.75),
    borderRadius: Number(theme.shape.borderRadius),
}));

export const PaletteSlotBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== '$isActive',
})<{ $isActive?: boolean }>(({ theme, $isActive }) => ({
    height: 40,
    marginBlock: theme.spacing(0.5),
    borderRadius: Number(theme.shape.borderRadius),
    backgroundColor: $isActive ? theme.palette.primary.light : 'transparent',
    border: '2px dotted',
    borderColor: theme.palette.primary.main,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
        backgroundColor: $isActive
            ? theme.palette.primary.light
            : theme.palette.action.hover,
    },
}));

export const ReorderSlotBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== '$isActive',
})<{ $isActive?: boolean }>(({ theme, $isActive }) => ({
    height: $isActive ? 40 : 10,
    marginBlock: theme.spacing(0.5),
    borderRadius: Number(theme.shape.borderRadius),
    backgroundColor: $isActive ? theme.palette.primary.light : 'transparent',
    border: $isActive ? '2px dashed' : 'none',
    borderColor: theme.palette.primary.main,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
        backgroundColor: $isActive
            ? theme.palette.primary.light
            : theme.palette.action.hover,
        height: 20,
    },
}));

export const DropHintBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== '$isActive',
})<{ $isActive?: boolean }>(({ theme, $isActive }) => ({
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1.5),
    minHeight: 56,
    display: 'flex',
    alignItems: 'center',
    borderRadius: Number(theme.shape.borderRadius),
    border: '2px dotted',
    borderColor: $isActive ? theme.palette.primary.main : theme.palette.divider,
    backgroundColor: $isActive ? theme.palette.primary.light : 'transparent',
    transition: 'all 0.15s ease',
    '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.action.hover,
    },
}));

export const ContainerBranch = styled(Box)(({ theme }) => ({
    marginLeft: theme.spacing(0.5),
    borderLeft: `2px solid ${theme.palette.divider}`,
    paddingLeft: theme.spacing(1),
    marginTop: theme.spacing(2),
}));

export const RichTextWrapper = styled(Box)(({ theme }) => ({
    width: '100%',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));
