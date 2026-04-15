'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Typography,
  Button,
  Paper,
  Box,
  Stack,
  LinearProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  ButtonBase,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
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
import {
  Homework,
  SubmittedHomework,
  Question,
} from '../../../../_lib/interfaces/types';
import { format } from 'date-fns';
import PDFViewer from '@/app/_lib/components/PDFViewer/PDFViewer';
import QuestionTextDisplay from '@/app/_lib/components/TipTapEditor/QuestionTextDisplay';
import { VideoPlayer } from '@/app/_lib/components/video/VideoPlayer';
import { sortQuestionTreeByDisplayOrder } from '@/app/_lib/utils/questionOrder';
import { extractPlainText } from '@/app/_lib/utils/textUtils';
import ConfirmDialog from '@/app/_lib/components/dialog/ConfirmDialog';

/* ── Layout ── */
/* ── Public type for toolbar render-prop ── */
export interface HomeworkNavState {
  currentIndex: number;
  totalQuestions: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
  isCompleted: (index: number) => boolean;
  readOnly: boolean;
  onSubmit: () => void;
}

/* ── Styled step pill (exported for parent toolbar) ── */
export const StepPill = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'completed' && prop !== 'active',
})<{ completed: boolean; active: boolean }>(({ theme, completed, active }) => {
  const completeAlpha = theme.palette.mode === 'dark' ? 0.24 : 0.12;
  const activeAlpha = theme.palette.mode === 'dark' ? 0.28 : 0.15;

  let borderColor = alpha(theme.palette.divider, 0.95);
  let backgroundColor = theme.palette.background.paper;
  let textColor = theme.palette.text.secondary;

  if (completed) {
    borderColor = alpha(theme.palette.success.main, 0.55);
    backgroundColor = alpha(theme.palette.success.main, completeAlpha);
    textColor = theme.palette.success.main;
  }
  if (active) {
    borderColor = alpha(theme.palette.primary.main, 0.6);
    backgroundColor = alpha(theme.palette.primary.main, activeAlpha);
    textColor = theme.palette.primary.main;
  }

  return {
    height: 28,
    minWidth: 38,
    borderRadius: 999,
    paddingInline: theme.spacing(0.75),
    border: `1px solid ${borderColor}`,
    backgroundColor,
    color: textColor,
    fontWeight: 600,
    fontSize: 11,
  };
});

/* ── Layout ── */
const PageSurface = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
  flex: 1,
  width: '100%',
  minHeight: 0,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

const NodeCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'depth',
})<{ depth: number }>(({ theme, depth }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  marginInlineStart: depth > 1 ? theme.spacing((depth - 1) * 2) : 0,
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${alpha(theme.palette.divider, 0.95)}`,
  borderLeft: `4px solid ${alpha(theme.palette.text.secondary, theme.palette.mode === 'dark' ? 0.6 : 0.3)}`,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
}));

const ViewShell = styled(Box)(() => ({
  height: '100%',
  width: '100%',
  minHeight: 0,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

const FooterBar = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
  backgroundColor: alpha(
    theme.palette.background.paper,
    theme.palette.mode === 'dark' ? 0.96 : 0.98
  ),
  flexShrink: 0,
  width: '100%',
  padding: theme.spacing(1, 2),
  marginTop: theme.spacing(1.5),
}));

const DotStepper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
  overflowX: 'auto',
  overflowY: 'hidden',
  whiteSpace: 'nowrap',
  alignItems: 'center',
  flex: 1,
  minWidth: 0,
  justifyContent: 'center',
}));

const FooterProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  borderRadius: 999,
  backgroundColor: alpha(theme.palette.success.main, theme.palette.mode === 'dark' ? 0.16 : 0.12),
  '& .MuiLinearProgress-bar': { borderRadius: 999 },
}));

const formatFileSize = (bytes?: number | null) => {
  if (!bytes || bytes <= 0) return null;
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) {
    return `${mb.toFixed(1)} MB`;
  }
  return `${(bytes / 1024).toFixed(1)} KB`;
};

interface HomeworkViewProps {
  homework: Homework;
  onSubmit: (submittedHomework: SubmittedHomework) => void;
  readOnly?: boolean;
  onBack?: () => void;
  onNavChange?: (nav: HomeworkNavState) => void;
}

/* Cover page index is -1, questions are 0..n-1 */
const COVER_PAGE = -1;

const HomeworkView: React.FC<HomeworkViewProps> = ({
  homework,
  onSubmit,
  readOnly = false,
  onBack,
  onNavChange,
}) => {
  const [answers, setAnswers] = useState<{ [questionId: string]: any }>({});
  const [currentPage, setCurrentPage] = useState(COVER_PAGE);
  const [pdfPreview, setPdfPreview] = useState<{
    title: string;
    url: string;
    key?: string | null;
  } | null>(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showBackWarning, setShowBackWarning] = useState(false);

  const sortedQuestions = useMemo(
    () => sortQuestionTreeByDisplayOrder(homework.questions),
    [homework.questions]
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
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    }
  };

  const handleMultiSelectToggle = (
    questionId: string,
    option: string,
    checked: boolean
  ) => {
    if (readOnly) return;
    const prev = Array.isArray(answers[questionId])
      ? (answers[questionId] as string[])
      : [];
    const next = checked
      ? [...prev, option]
      : prev.filter((item) => item !== option);
    handleChange(questionId, next);
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
    const hasStarted = Object.keys(answers).length > 0 || currentPage !== COVER_PAGE;
    if (hasStarted) {
      setShowBackWarning(true);
    } else {
      onBack?.();
    }
  };

  const confirmBack = () => {
    setShowBackWarning(false);
    onBack?.();
  };

  const computeTotalWeight = (node: Question): number => {
    if (node.subquestions && node.subquestions.length > 0) {
      return node.subquestions.reduce((s, sub) => s + computeTotalWeight(sub), 0);
    }
    return Number.isFinite(node.weight) ? node.weight : 0;
  };

  const totalWeight = useMemo(
    () => sortedQuestions.reduce((s, q) => s + computeTotalWeight(q), 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sortedQuestions]
  );

  const openPdfPreview = (fallbackTitle: string, pdf?: Question['pdf']) => {
    if (!pdf?.url) return;
    setPdfPreview({
      title: pdf.title || fallbackTitle || 'PDF Document',
      url: pdf.url,
      key: pdf.key,
    });
  };

  const closePdfPreview = () => setPdfPreview(null);

  const isAnsweredValue = (value: unknown): boolean => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim().length > 0;
    return value !== undefined && value !== null;
  };

  const isNodeCompleted = (node: Question): boolean => {
    if (node.subquestions && node.subquestions.length > 0) {
      return node.subquestions.every(isNodeCompleted);
    }
    return isAnsweredValue(answers[node.id]);
  };

  const answeredCount = sortedQuestions.filter(isNodeCompleted).length;
  const completionPercent =
    totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  /* ── Nav state for parent ── */
  const navState: HomeworkNavState = {
    currentIndex: safeIndex,
    totalQuestions,
    canGoPrev: currentPage > COVER_PAGE,
    canGoNext: !isCoverPage && safeIndex < totalQuestions - 1,
    onPrev: () => setCurrentPage((p) => Math.max(COVER_PAGE, p - 1)),
    onNext: () => setCurrentPage((p) => Math.min(totalQuestions - 1, p + 1)),
    onGoTo: setCurrentPage,
    isCompleted: (i) => isNodeCompleted(sortedQuestions[i]),
    readOnly,
    onSubmit: (e?: any) => handleSubmit(e ?? { preventDefault: () => {} }),
  };

  useEffect(() => {
    onNavChange?.(navState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeIndex, totalQuestions, readOnly, answers, currentPage]);

  /* ── Helpers ── */
  const startExam = () => setCurrentPage(0);

  const renderPdfAttachment = (
    title: string,
    pdf?: Question['pdf'],
    options: { compact?: boolean } = {}
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
    depth: number = 1
  ): React.ReactNode => {
    const textVariant = depth === 1 ? 'h6' : 'subtitle1';

    if (node.subquestions && node.subquestions.length > 0) {
      const sectionWeight = computeTotalWeight(node);
      return (
        <NodeCard key={node.id} depth={depth}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'baseline' }}>
            <Typography variant={textVariant} sx={{ fontWeight: 600 }}>
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
          </Box>
          {node.type === 'video' && (
            <Box sx={{ mt: 2 }}>
              {node.video ? (
                <VideoPlayer video={node.video} />
              ) : (
                <Typography variant="body2" color="text.secondary">Video unavailable</Typography>
              )}
            </Box>
          )}
          {node.type === 'pdf' &&
            renderPdfAttachment(extractPlainText(node.questionText) || 'PDF section', node.pdf)}
          {node.subquestions.map((sub, idx) =>
            renderQuestionNode(sub, `${numbering}.${idx + 1}`, depth + 1)
          )}
        </NodeCard>
      );
    }

    const opts = node.options ?? [];
    return (
      <NodeCard key={node.id} depth={depth}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'baseline' }}>
            <Typography variant={textVariant}>{numbering}.</Typography>
            <QuestionTextDisplay
              content={node.questionText}
              fallback="Untitled question"
              variant={textVariant}
              component="span"
              sx={{ flex: 1, minWidth: 0 }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary">
            ({Number.isFinite(node.weight) ? node.weight : 0} marks)
          </Typography>
        </Box>
        <Box sx={{ mt: 1.5 }}>
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
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
                </Box>
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
                { compact: true }
              );
            }
            return (
              <Typography variant="body2" color="text.secondary">
                Unsupported question type
              </Typography>
            );
          })()}
        </Box>
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
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: { xs: 2, md: 4 },
          px: { xs: 1, sm: 2 },
        }}
      >
        <Stack
          spacing={4}
          sx={{ width: '100%', maxWidth: 860 }}
        >
          {/* ── Hero header ── */}
          <Box
            sx={(theme) => ({
              background:
                theme.palette.mode === 'dark'
                  ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.35)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`
                  : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.light, 0.04)} 100%)`,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
              px: { xs: 2.5, sm: 4 },
              py: { xs: 3, sm: 4 },
            })}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
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
          </Box>

          {/* ── Stat cards ── */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: `repeat(${expiryDate ? 4 : 3}, 1fr)`,
              },
              gap: { xs: 1.5, sm: 2 },
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
          </Box>

          {/* ── Question breakdown ── */}
          {sortedQuestions.length > 0 && (
            <Box
              sx={(theme) => ({
                borderRadius: 2.5,
                border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                overflow: 'hidden',
              })}
            >
              <Box
                sx={(theme) => ({
                  px: { xs: 2, sm: 3 },
                  py: 1.5,
                  backgroundColor: alpha(
                    theme.palette.text.primary,
                    theme.palette.mode === 'dark' ? 0.06 : 0.03,
                  ),
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                })}
              >
                <Typography variant="subtitle1" fontWeight={700}>
                  Question Breakdown
                </Typography>
              </Box>
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
                          backgroundColor: (theme) =>
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
                          sx={{ fontWeight: 700, mr: 0.75, color: 'text.secondary' }}
                        >
                          {i + 1}.
                        </Box>
                        {label}
                      </Typography>
                      <Box
                        sx={(theme) => ({
                          ml: 2,
                          flexShrink: 0,
                          px: 1.25,
                          py: 0.25,
                          borderRadius: 1,
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          backgroundColor: alpha(theme.palette.success.main, 0.1),
                          color: theme.palette.success.main,
                        })}
                      >
                        {weight} {weight === 1 ? 'mark' : 'marks'}
                      </Box>
                    </Stack>
                  );
                })}
              </Stack>
            </Box>
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
      </Box>
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
                <Box sx={{ flex: 1, minHeight: 0, minWidth: 0, overflowY: 'auto', pr: 0.5 }}>
                  {renderQuestionNode(
                    sortedQuestions[safeIndex],
                    String(safeIndex + 1)
                  )}
                </Box>
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
                      completed={isNodeCompleted(q)}
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
            <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <PDFViewer fileUrl={pdfPreview.url} initialPage={1} />
            </Box>
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

/* ── Stat card for cover page ── */
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
    <Paper
      variant="outlined"
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: { xs: 2, sm: 2.5 },
        py: { xs: 1.75, sm: 2 },
        borderRadius: 2.5,
        borderColor: alpha(theme.palette[color].main, 0.25),
        backgroundColor: alpha(
          theme.palette[color].main,
          theme.palette.mode === 'dark' ? 0.08 : 0.04,
        ),
      })}
    >
      <Box
        sx={(theme) => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 42,
          height: 42,
          borderRadius: '50%',
          backgroundColor: alpha(theme.palette[color].main, 0.15),
          color: theme.palette[color].main,
          flexShrink: 0,
          '& .MuiSvgIcon-root': { fontSize: 22 },
        })}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.7rem' }}
        >
          {label}
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontWeight: 700, lineHeight: 1.3, fontSize: { xs: '0.95rem', sm: '1rem' } }}
          noWrap
        >
          {value}
        </Typography>
      </Box>
    </Paper>
  );
}

export default HomeworkView;
