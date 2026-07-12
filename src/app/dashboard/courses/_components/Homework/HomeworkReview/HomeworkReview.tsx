'use client';

import React, { useMemo, useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Paper,
    Box,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import type { Question } from '../../../../../_lib/interfaces/types';
import { format } from 'date-fns';
import PDFViewer from '@/app/_lib/components/PDFViewer/PDFViewer';
import QuestionTextDisplay from '@/app/_lib/components/TipTapEditor/QuestionTextDisplay';
import PaginatedQuestionLayout from '@/app/_lib/components/homework/PaginatedQuestionLayout';
import { sortQuestionTreeByDisplayOrder } from '@/app/_lib/utils/questionOrder';
import { VideoPlayer } from '@/app/_lib/components/video/VideoPlayer';
import { extractPlainText } from '@/app/_lib/utils/textUtils';
import type { HomeworkReviewProps, PdfPreviewState } from './types';
import { formatFileSize, computeTotalWeight, buildPdfPreview } from './utils';
import {
    FlexWrapRow,
    FlexColumnBox,
    QuestionWrapper,
    AnswerArea,
    VideoWrapper,
    PdfViewerBox,
    MultiSelectColumn,
} from './elements';

const HomeworkReview: React.FC<HomeworkReviewProps> = ({
    submittedHomework,
}) => {
    const { homework, answers } = submittedHomework;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [pdfPreview, setPdfPreview] = useState<PdfPreviewState | null>(null);

    const sortedQuestions = useMemo(
        () => sortQuestionTreeByDisplayOrder(homework.questions),
        [homework.questions],
    );

    const openPdfPreview = (fallbackTitle: string, pdf?: Question['pdf']) => {
        const preview = buildPdfPreview(fallbackTitle, pdf);
        if (preview) setPdfPreview(preview);
    };

    const closePdfPreview = () => setPdfPreview(null);

    const renderPdfAttachment = (
        title: string,
        pdf?: Question['pdf'],
        options: { compact?: boolean } = {},
    ) => {
        const mt = options.compact ? 1 : 2;

        if (!pdf?.url) {
            return (
                <Paper variant="outlined" sx={{ mt, p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Document unavailable
                    </Typography>
                </Paper>
            );
        }

        const sizeLabel = formatFileSize(pdf.sizeBytes);

        return (
            <Paper variant="outlined" sx={{ mt, p: 2 }}>
                <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <PictureAsPdfIcon color="error" />
                        <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                                {pdf.title || title || 'PDF Document'}
                            </Typography>
                            {pdf.key && (
                                <Typography variant="caption" color="text.secondary">
                                    {pdf.key}
                                </Typography>
                            )}
                        </Box>
                        <Box flexGrow={1} />
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<PictureAsPdfIcon />}
                            onClick={() => openPdfPreview(title, pdf)}
                        >
                            Open PDF
                        </Button>
                    </Stack>
                    {sizeLabel && (
                        <Typography variant="caption" color="text.secondary">
                            Size: {sizeLabel}
                        </Typography>
                    )}
                </Stack>
            </Paper>
        );
    };

    const renderQuestionNode = (
        node: Question,
        numbering: string,
        depth: number = 1,
    ): React.ReactNode => {
        const indent = depth > 1 ? depth - 1 : 0;
        const textVariant = depth === 1 ? 'h6' : 'subtitle1';

        if (node.subquestions && node.subquestions.length > 0) {
            const sectionWeight = computeTotalWeight(node);
            return (
                <QuestionWrapper key={node.id} $indent={indent}>
                    <FlexWrapRow>
                        <Typography variant={textVariant} fontWeight={600}>
                            {numbering}.
                        </Typography>
                        <QuestionTextDisplay
                            content={node.questionText}
                            fallback="Untitled section"
                            variant={textVariant}
                            component="span"
                            fontWeight={600}
                            sx={{ flex: 1, minWidth: 0 }}
                        />
                        {sectionWeight > 0 && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                component="span"
                            >
                                (Total Weight: {sectionWeight})
                            </Typography>
                        )}
                    </FlexWrapRow>
                    {node.type === 'video' && (
                        <VideoWrapper>
                            {node.video ? (
                                <VideoPlayer video={node.video} />
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    Video unavailable
                                </Typography>
                            )}
                        </VideoWrapper>
                    )}
                    {node.type === 'pdf' &&
                        renderPdfAttachment(
                            extractPlainText(node.questionText) || 'PDF section',
                            node.pdf,
                        )}
                    {node.subquestions.map((sub, idx) =>
                        renderQuestionNode(sub, `${numbering}.${idx + 1}`, depth + 1),
                    )}
                </QuestionWrapper>
            );
        }

        const options = node.options ?? [];
        const answer = answers[node.id];

        return (
            <QuestionWrapper key={node.id} $indent={indent}>
                <FlexColumnBox>
                    <FlexWrapRow>
                        <Typography variant={textVariant}>{numbering}.</Typography>
                        <QuestionTextDisplay
                            content={node.questionText}
                            fallback="Untitled question"
                            variant={textVariant}
                            component="span"
                            sx={{ flex: 1, minWidth: 0 }}
                        />
                    </FlexWrapRow>
                    <Typography variant="caption" color="text.secondary">
                        (Weight: {Number.isFinite(node.weight) ? node.weight : 0})
                    </Typography>
                </FlexColumnBox>
                <AnswerArea>
                    {(() => {
                        if (node.type === 'single-select') {
                            return (
                                <RadioGroup value={answer || ''} row>
                                    {options.length > 0 ? (
                                        options.map((option, idx) => (
                                            <FormControlLabel
                                                key={idx}
                                                value={option}
                                                control={<Radio disabled />}
                                                label={option || `Option ${idx + 1}`}
                                            />
                                        ))
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            Options will appear here
                                        </Typography>
                                    )}
                                </RadioGroup>
                            );
                        }

                        if (node.type === 'multi-select') {
                            return options.length > 0 ? (
                                <MultiSelectColumn>
                                    {options.map((option, idx) => (
                                        <FormControlLabel
                                            key={idx}
                                            control={
                                                <Checkbox
                                                    disabled
                                                    checked={
                                                        Array.isArray(answer)
                                                            ? answer.includes(option)
                                                            : false
                                                    }
                                                />
                                            }
                                            label={option || `Option ${idx + 1}`}
                                        />
                                    ))}
                                </MultiSelectColumn>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    Options will appear here
                                </Typography>
                            );
                        }

                        if (node.type === 'video') {
                            return node.video ? (
                                <VideoPlayer video={node.video} />
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    Video unavailable
                                </Typography>
                            );
                        }

                        if (node.type === 'pdf') {
                            return renderPdfAttachment(
                                node.questionText || 'PDF question',
                                node.pdf,
                                { compact: true },
                            );
                        }

                        return (
                            <Typography variant="body2" color="text.secondary">
                                Unsupported question type
                            </Typography>
                        );
                    })()}
                </AnswerArea>
            </QuestionWrapper>
        );
    };

    return (
        <React.Fragment>
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <Typography sx={{ flex: '1 1 auto' }} variant="h6">
                        Due on{' '}
                        {format(new Date(Date.parse(homework.dueDate)), 'MM/ dd / yyyy')}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Paper sx={{ p: 2, m: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                    {homework.description}
                </Typography>
                <PaginatedQuestionLayout
                    questions={sortedQuestions}
                    currentIndex={currentQuestionIndex}
                    onIndexChange={setCurrentQuestionIndex}
                    renderQuestion={(question, numbering) =>
                        renderQuestionNode(question, numbering)
                    }
                    summaryLabel={(index, total) => (
                        <Typography variant="subtitle1">
                            Viewing Question {index + 1} of {total}
                        </Typography>
                    )}
                    emptyState={
                        <Typography variant="body2" color="text.secondary">
                            No questions to display.
                        </Typography>
                    }
                />
            </Paper>
            <Dialog
                open={Boolean(pdfPreview)}
                onClose={closePdfPreview}
                fullWidth
                maxWidth="lg"
                PaperProps={{ sx: { height: { xs: '90vh', md: '80vh' } } }}
            >
                <DialogTitle sx={{ pr: 6 }}>
                    {pdfPreview?.title || 'PDF Document'}
                    <IconButton
                        onClick={closePdfPreview}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                        aria-label="Close"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent
                    dividers
                    sx={{
                        p: 0,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {pdfPreview?.url && (
                        <PdfViewerBox>
                            <PDFViewer fileUrl={pdfPreview.url} initialPage={1} />
                        </PdfViewerBox>
                    )}
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};

export default HomeworkReview;
