'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
    Typography,
    Button,
    Paper,
    Box,
    Stack,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import TimerOffRoundedIcon from '@mui/icons-material/TimerOffRounded';
import type { Question } from '../../../../../_lib/interfaces/types';
import { format } from 'date-fns';
import PDFViewer from '@/app/_lib/components/PDFViewer/PDFViewer';
import QuestionTextDisplay from '@/app/_lib/components/TipTapEditor/QuestionTextDisplay';
import { VideoPlayer } from '@/app/_lib/components/video/VideoPlayer';
import { sortQuestionTreeByDisplayOrder } from '@/app/_lib/utils/questionOrder';
import { extractPlainText } from '@/app/_lib/utils/textUtils';
import ConfirmDialog from '@/app/_lib/components/dialog/ConfirmDialog';
import type { HomeworkViewProps, HomeworkNavState, PdfPreviewState } from './interfaces';
import { COVER_PAGE } from './constants';
import {
    formatFileSize,
    computeTotalWeight,
    buildPdfPreview,
    isNodeCompleted,
    updateAnswer,
    toggleMultiSelectOption,
    hasAssessmentStarted,
    computeCompletionStats,
} from './utils';
import {
    StepPill,
    PageSurface,
    NodeCard,
    ViewShell,
    FooterBar,
    DotStepper,
    FooterProgressBar,
    FlexWrapRow,
    MultiSelectColumn,
    HeroBox,
    BreakdownContainer,
    BreakdownHeader,
    StatCardPaper,
    StatIconCircle,
    WeightBadge,
    CoverScrollArea,
    QuestionScrollBox,
    StatCardsGrid,
    AnswerArea,
    VideoWrapper,
    PdfViewerBox,
} from './elements';

/* ── Stat card sub-component ── */
function StatCard({
    icon,
    label,
    value,
    color,
}: Readonly<{
    icon: React.ReactNode;
    label: string;
    value: string;
    color: 'primary' | 'info' | 'success' | 'warning';
}>) {
    return (
        <StatCardPaper variant="outlined" $color={color}>
            <StatIconCircle $color={color}>
                {icon}
            </StatIconCircle>
            <Box sx={{ minWidth: 0 }}>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    textTransform="uppercase"
                    fontWeight={600}
                    sx={{ letterSpacing: '0.04em', fontSize: '0.7rem' }}
                >
                    {label}
                </Typography>
                <Typography
                    variant="body1"
                    fontWeight={700}
                    noWrap
                    sx={{ lineHeight: 1.3, fontSize: { xs: '0.95rem', sm: '1rem' } }}
                >
                    {value}
                </Typography>
            </Box>
        </StatCardPaper>
    );
}

const HomeworkView: React.FC<HomeworkViewProps> = ({
    homework,
    onSubmit,
    readOnly = false,
    onBack,
    onNavChange,
}) => {
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [currentPage, setCurrentPage] = useState(COVER_PAGE);
    const [pdfPreview, setPdfPreview] = useState<PdfPreviewState | null>(null);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
    const [showBackWarning, setShowBackWarning] = useState(false);

    const sortedQuestions = useMemo(
        () => sortQuestionTreeByDisplayOrder(homework.questions),
        [homework.questions],
    );

    const totalQuestions = sortedQuestions.length;
    const isCoverPage = currentPage === COVER_PAGE;
    const questionIndex = isCoverPage ? 0 : currentPage;
    const safeIndex =
        totalQuestions > 0
            ? Math.min(Math.max(questionIndex, 0), totalQuestions - 1)
            : 0;

    const handleChange = (questionId: string, value: any) => {
        if (!readOnly) {
            setAnswers((prev) => updateAnswer(prev, questionId, value));
        }
    };

    const handleMultiSelectToggle = (
        questionId: string,
        option: string,
        checked: boolean,
    ) => {
        if (readOnly) return;
        setAnswers((prev) => toggleMultiSelectOption(prev, questionId, option, checked));
    };

    const createMultiSelectHandler = (questionId: string, option: string) => {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            handleMultiSelectToggle(questionId, option, event.target.checked);
        };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!readOnly) {
            setShowSubmitConfirm(true);
        }
    };

    const confirmSubmit = () => {
        setShowSubmitConfirm(false);
        onSubmit({ homework, answers });
    };

    const handleBackClick = () => {
        if (hasAssessmentStarted(answers, currentPage)) {
            setShowBackWarning(true);
        } else {
            onBack?.();
        }
    };

    const confirmBack = () => {
        setShowBackWarning(false);
        onBack?.();
    };

    const totalWeight = useMemo(
        () => sortedQuestions.reduce((s, q) => s + computeTotalWeight(q), 0),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [sortedQuestions],
    );

    const openPdfPreview = (fallbackTitle: string, pdf?: Question['pdf']) => {
        const preview = buildPdfPreview(fallbackTitle, pdf);
        if (preview) setPdfPreview(preview);
    };

    const closePdfPreview = () => setPdfPreview(null);

    const { answeredCount, completionPercent } = useMemo(
        () => computeCompletionStats(sortedQuestions, answers),
        [sortedQuestions, answers],
    );

    /* ── Nav state for parent ── */
    const navState: HomeworkNavState = {
        currentIndex: safeIndex,
        totalQuestions,
        canGoPrev: currentPage > COVER_PAGE,
        canGoNext: !isCoverPage && safeIndex < totalQuestions - 1,
        onPrev: () => setCurrentPage((p) => Math.max(COVER_PAGE, p - 1)),
        onNext: () => setCurrentPage((p) => Math.min(totalQuestions - 1, p + 1)),
        onGoTo: setCurrentPage,
        isCompleted: (i) => isNodeCompleted(sortedQuestions[i], answers),
        readOnly,
        onSubmit: (e?: any) => handleSubmit(e ?? { preventDefault: () => {} }),
    };

    useEffect(() => {
        onNavChange?.(navState);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [safeIndex, totalQuestions, readOnly, answers, currentPage]);

    const startExam = () => setCurrentPage(0);

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
        const textVariant = depth === 1 ? 'h6' : 'subtitle1';

        if (node.subquestions && node.subquestions.length > 0) {
            const sectionWeight = computeTotalWeight(node);
            return (
                <NodeCard key={node.id} depth={depth}>
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
                            <Typography variant="body2" color="text.secondary" component="span">
                                ({sectionWeight} marks)
                            </Typography>
                        )}
                    </FlexWrapRow>
                    {node.type === 'video' && (
                        <VideoWrapper>
                            {node.video ? (
                                <VideoPlayer video={node.video} />
                            ) : (
                                <Typography variant="body2" color="text.secondary">Video unavailable</Typography>
                            )}
                        </VideoWrapper>
                    )}
                    {node.type === 'pdf' &&
                        renderPdfAttachment(extractPlainText(node.questionText) || 'PDF section', node.pdf)}
                    {node.subquestions.map((sub, idx) =>
                        renderQuestionNode(sub, `${numbering}.${idx + 1}`, depth + 1),
                    )}
                </NodeCard>
            );
        }

        const opts = node.options ?? [];
        return (
            <NodeCard key={node.id} depth={depth}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
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
                        ({Number.isFinite(node.weight) ? node.weight : 0} marks)
                    </Typography>
                </Box>
                <AnswerArea>
                    {(() => {
                        if (node.type === 'single-select') {
                            return (
                                <RadioGroup
                                    value={answers[node.id] || ''}
                                    onChange={(e) => handleChange(node.id, e.target.value)}
                                    row
                                >
                                    {opts.length > 0 ? (
                                        opts.map((option, idx) => (
                                            <FormControlLabel
                                                key={`${node.id}-single-${option}-${idx}`}
                                                value={option}
                                                control={<Radio disabled={readOnly} />}
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
                            return opts.length > 0 ? (
                                <MultiSelectColumn>
                                    {opts.map((option, idx) => (
                                        <FormControlLabel
                                            key={`${node.id}-multi-${option}-${idx}`}
                                            control={
                                                <Checkbox
                                                    disabled={readOnly}
                                                    checked={
                                                        Array.isArray(answers[node.id])
                                                            ? (answers[node.id] as string[]).includes(option)
                                                            : false
                                                    }
                                                    onChange={createMultiSelectHandler(node.id, option)}
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
                                <Typography variant="body2" color="text.secondary">Video unavailable</Typography>
                            );
                        }
                        if (node.type === 'pdf') {
                            return renderPdfAttachment(
                                extractPlainText(node.questionText) || 'PDF question',
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
            </NodeCard>
        );
    };

    /* ── Cover page ── */
    const renderCoverPage = () => {
        const dueDate = format(new Date(Date.parse(homework.dueDate)), 'MMMM d, yyyy');
        const hasExpiry = homework.hasExpiry && homework.expiryDate;
        const expiryDate = hasExpiry
            ? format(new Date(Date.parse(homework.expiryDate!)), 'MMMM d, yyyy')
            : null;

        return (
            <CoverScrollArea>
                <Stack spacing={4} sx={{ width: '100%', maxWidth: 860 }}>
                    {/* ── Hero header ── */}
                    <HeroBox>
                        <Typography
                            variant="h4"
                            fontWeight={800}
                            sx={{
                                letterSpacing: '-0.02em',
                                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
                                lineHeight: 1.2,
                                mb: homework.description ? 1.5 : 0,
                            }}
                        >
                            {homework.title}
                        </Typography>
                        {homework.description && (
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{
                                    fontSize: { xs: '0.95rem', sm: '1.05rem' },
                                    lineHeight: 1.7,
                                    maxWidth: 640,
                                }}
                            >
                                {homework.description}
                            </Typography>
                        )}
                    </HeroBox>

                    {/* ── Stat cards ── */}
                    <StatCardsGrid
                        sx={{
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                md: `repeat(${expiryDate ? 4 : 3}, 1fr)`,
                            },
                        }}
                    >
                        <StatCard
                            icon={<CalendarTodayRoundedIcon />}
                            label="Due Date"
                            value={dueDate}
                            color="primary"
                        />
                        {expiryDate && (
                            <StatCard
                                icon={<TimerOffRoundedIcon />}
                                label="Expires"
                                value={expiryDate}
                                color="warning"
                            />
                        )}
                        <StatCard
                            icon={<QuizRoundedIcon />}
                            label="Questions"
                            value={String(totalQuestions)}
                            color="info"
                        />
                        <StatCard
                            icon={<EmojiEventsRoundedIcon />}
                            label="Total Marks"
                            value={String(totalWeight)}
                            color="success"
                        />
                    </StatCardsGrid>

                    {/* ── Google Calendar link for scheduled exams ── */}
                    {homework.isExam && homework.scheduledAt && (() => {
                        const start = new Date(homework.scheduledAt);
                        const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour default
                        const fmt = (d: Date) => d.toISOString().replaceAll(/[-:]/g, '').replace(/\.\d{3}/, '');
                        const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(homework.title)}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent(homework.description || '')}`;
                        return (
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<CalendarTodayRoundedIcon />}
                                href={calUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
                            >
                                Add to Google Calendar
                            </Button>
                        );
                    })()}

                    {/* ── Question breakdown ── */}
                    {sortedQuestions.length > 0 && (
                        <BreakdownContainer>
                            <BreakdownHeader>
                                <Typography variant="subtitle1" fontWeight={700}>
                                    Question Breakdown
                                </Typography>
                            </BreakdownHeader>
                            <Stack divider={<Divider />}>
                                {sortedQuestions.map((q, i) => {
                                    const label = extractPlainText(q.questionText) || `Question ${i + 1}`;
                                    const weight = computeTotalWeight(q);
                                    return (
                                        <Stack
                                            key={q.id}
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            sx={{
                                                px: { xs: 2, sm: 3 },
                                                py: 1.25,
                                                '&:hover': {
                                                    backgroundColor: (theme: any) =>
                                                        alpha(theme.palette.action.hover, 0.04),
                                                },
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                noWrap
                                                sx={{
                                                    flex: 1,
                                                    minWidth: 0,
                                                    fontSize: { xs: '0.85rem', sm: '0.9rem' },
                                                }}
                                            >
                                                <Box
                                                    component="span"
                                                    fontWeight={700}
                                                    sx={{ mr: 0.75, color: 'text.secondary' }}
                                                >
                                                    {i + 1}.
                                                </Box>
                                                {label}
                                            </Typography>
                                            <WeightBadge>
                                                {weight} {weight === 1 ? 'mark' : 'marks'}
                                            </WeightBadge>
                                        </Stack>
                                    );
                                })}
                            </Stack>
                        </BreakdownContainer>
                    )}

                    {/* ── Begin button ── */}
                    {!readOnly && totalQuestions > 0 && (
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<PlayArrowRoundedIcon />}
                            onClick={startExam}
                            sx={{
                                alignSelf: { xs: 'stretch', sm: 'flex-start' },
                                fontWeight: 700,
                                px: 5,
                                py: 1.5,
                                fontSize: '1rem',
                                borderRadius: 2,
                            }}
                        >
                            Begin Assessment
                        </Button>
                    )}
                </Stack>
            </CoverScrollArea>
        );
    };

    /* ── Render ── */
    return (
        <React.Fragment>
            <ViewShell>
                <PageSurface>
                    {onBack && (
                        <Button
                            size="small"
                            onClick={handleBackClick}
                            startIcon={<ArrowBackRoundedIcon fontSize="small" />}
                            variant="contained"
                            color="warning"
                            sx={{ alignSelf: 'flex-start', fontWeight: 700, px: 4, mb: 2 }}
                        >
                            Back to assessments
                        </Button>
                    )}
                    {isCoverPage ? (
                        renderCoverPage()
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                flex: 1,
                                width: '100%',
                                minHeight: 0,
                            }}
                        >
                            {totalQuestions > 0 ? (
                                <QuestionScrollBox>
                                    {renderQuestionNode(
                                        sortedQuestions[safeIndex],
                                        String(safeIndex + 1),
                                    )}
                                </QuestionScrollBox>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No questions to display.
                                </Typography>
                            )}
                        </form>
                    )}
                </PageSurface>

                {/* ── Footer nav bar ── */}
                {!isCoverPage && totalQuestions > 0 && (
                    <FooterBar>
                        <Stack spacing={0.75}>
                            <FooterProgressBar variant="determinate" color="success" value={completionPercent} />
                            <Stack direction="row" spacing={1} alignItems="center">
                                <IconButton
                                    size="small"
                                    disabled={currentPage <= COVER_PAGE}
                                    onClick={() => setCurrentPage((p) => Math.max(COVER_PAGE, p - 1))}
                                    sx={{ border: (t) => `1px solid ${alpha(t.palette.divider, 0.6)}`, borderRadius: 1, p: 0.5 }}
                                >
                                    <NavigateBeforeRoundedIcon fontSize="small" />
                                </IconButton>

                                <DotStepper>
                                    {sortedQuestions.map((q, i) => (
                                        <StepPill
                                            key={q.id}
                                            completed={isNodeCompleted(q, answers)}
                                            active={i === safeIndex}
                                            onClick={() => setCurrentPage(i)}
                                        >
                                            {i + 1}
                                        </StepPill>
                                    ))}
                                </DotStepper>

                                <IconButton
                                    size="small"
                                    disabled={safeIndex >= totalQuestions - 1}
                                    onClick={() => setCurrentPage((p) => Math.min(totalQuestions - 1, p + 1))}
                                    sx={{ border: (t) => `1px solid ${alpha(t.palette.divider, 0.6)}`, borderRadius: 1, p: 0.5 }}
                                >
                                    <NavigateNextRoundedIcon fontSize="small" />
                                </IconButton>

                                <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
                                    {answeredCount}/{totalQuestions}
                                </Typography>

                                {!readOnly && (
                                    <Button
                                        color="success"
                                        variant="contained"
                                        size="small"
                                        onClick={(e) => handleSubmit(e as any)}
                                        sx={{ fontWeight: 700, ml: 'auto' }}
                                    >
                                        Submit
                                    </Button>
                                )}
                            </Stack>
                        </Stack>
                    </FooterBar>
                )}
            </ViewShell>

            {/* ── PDF preview dialog ── */}
            <Dialog
                open={Boolean(pdfPreview)}
                onClose={closePdfPreview}
                fullWidth
                maxWidth="lg"
                slotProps={{ paper: { sx: { height: { xs: '95vh', md: '90vh' }, maxHeight: { xs: '95vh', md: '90vh' } } } }}
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
                    sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                >
                    {pdfPreview?.url && (
                        <PdfViewerBox>
                            <PDFViewer fileUrl={pdfPreview.url} initialPage={1} />
                        </PdfViewerBox>
                    )}
                </DialogContent>
            </Dialog>

            {/* ── Submit confirmation dialog ── */}
            <ConfirmDialog
                open={showSubmitConfirm}
                title="Submit Assessment"
                description={
                    <>
                        You have answered <strong>{answeredCount}</strong> of{' '}
                        <strong>{totalQuestions}</strong> questions.
                        {totalQuestions - answeredCount > 0 && (
                            <>
                                {' '}
                                <strong>
                                    {totalQuestions - answeredCount} question{totalQuestions - answeredCount !== 1 ? 's' : ''}
                                </strong>{' '}
                                remaining unanswered.
                            </>
                        )}
                        <br />
                        <br />
                        <strong>This action cannot be undone.</strong> Once submitted, you will not be
                        able to make changes to your answers.
                    </>
                }
                confirmText="Submit"
                cancelText="Continue Working"
                onConfirm={confirmSubmit}
                onCancel={() => setShowSubmitConfirm(false)}
            />

            {/* ── Back / leave warning dialog ── */}
            <ConfirmDialog
                open={showBackWarning}
                title="Leave Assessment?"
                description={
                    <>
                        You will lose all your changes if you leave. Your assessment will be
                        submitted with <strong>no questions completed</strong>.
                    </>
                }
                confirmText="Leave"
                cancelText="Stay"
                onConfirm={confirmBack}
                onCancel={() => setShowBackWarning(false)}
            />
        </React.Fragment>
    );
};

export default HomeworkView;
