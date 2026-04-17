'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

export const ModalContentArea = styled(Box)(({ theme }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3),
    gap: theme.spacing(2),
    height: '100%',
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(2),
    },
}));

export const StepPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    maxWidth: 960,
    marginInline: 'auto',
    overflow: 'auto',
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(2),
    },
}));

export const ReviewPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    maxWidth: 960,
    marginInline: 'auto',
    overflow: 'auto',
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(2),
    },
}));

export const SidebarContainer = styled(Box)(({ theme }) => ({
    width: 250,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
}));

export const PaletteDragItem = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    cursor: 'grab',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

export const EmptyEditorArea = styled(Box)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px dashed',
    borderColor: theme.palette.divider,
    borderRadius: Number(theme.shape.borderRadius) * 2,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
    padding: theme.spacing(4),
    textAlign: 'center',
}));

export const PreviewPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    flex: 1,
    borderRadius: Number(theme.shape.borderRadius) * 2,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
}));

export const BuilderContentBox = styled(Box)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    minHeight: 0,
}));

export const ToolbarActionsBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
}));

export const StepperContainer = styled(Box)(({ theme }) => ({
    flex: 1,
    paddingInline: theme.spacing(5),
}));

export const DetailsGrid = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
    },
}));
