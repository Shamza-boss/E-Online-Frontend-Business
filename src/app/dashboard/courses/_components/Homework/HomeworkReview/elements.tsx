import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const FlexWrapRow = styled(Box)({
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'baseline',
});

export const FlexColumnBox = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
});

export const QuestionWrapper = styled(Box, {
    shouldForwardProp: (prop) => prop !== '$indent',
})<{ $indent: number }>(({ theme, $indent }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginLeft: $indent > 0 ? theme.spacing($indent * 2) : 0,
}));

export const AnswerArea = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(1),
}));

export const VideoWrapper = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
}));

export const PdfViewerBox = styled(Box)({
    flex: 1,
    minHeight: 0,
});

export const DialogContentFlex = styled(Box)({
    padding: 0,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
});

export const MultiSelectColumn = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
});
