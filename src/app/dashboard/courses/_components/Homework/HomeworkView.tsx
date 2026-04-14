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
      onSubmit({ homework, answers });
    }
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
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', pr: 0.5, py: 1 }}>
        <Stack spacing={3} sx={{ maxWidth: 680 }}>
          {homework.description && (
            <Typography variant="body1" color="text.secondary">
              {homework.description}
            </Typography>
          )}

          <Divider />

          <Stack spacing={1.5}>
            <DetailRow label="Due date" value={dueDate} />
            {expiryDate && <DetailRow label="Expires" value={expiryDate} />}
            <DetailRow label="Questions" value={String(totalQuestions)} />
            <DetailRow label="Total marks" value={String(totalWeight)} />
            {homework.completions !== undefined && homework.totalStudents !== undefined && (
              <DetailRow
                label="Completions"
                value={`${homework.completions} / ${homework.totalStudents}`}
              />
            )}
          </Stack>

          <Divider />

          {/* Question breakdown */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Question breakdown
            </Typography>
            <Stack spacing={0.75}>
              {sortedQuestions.map((q, i) => {
                const label = extractPlainText(q.questionText) || `Question ${i + 1}`;
                const weight = computeTotalWeight(q);
                return (
                  <Stack key={q.id} direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" noWrap sx={{ flex: 1, minWidth: 0 }}>
                      {i + 1}. {label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2, flexShrink: 0 }}>
                      {weight} {weight === 1 ? 'mark' : 'marks'}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Box>

          {!readOnly && totalQuestions > 0 && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<PlayArrowRoundedIcon />}
              onClick={startExam}
              sx={{ alignSelf: 'flex-start', fontWeight: 700, px: 4 }}
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
              onClick={onBack}
              startIcon={<ArrowBackRoundedIcon fontSize="small" />}
              variant="contained"
              color="warning"
              sx={{ alignSelf: 'flex-start', fontWeight: 700, px: 4, mb: 2 }}
            >
              Back to modules
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
        slotProps={{ paper: { sx: { height: { xs: '90vh', md: '80vh' } } } }}
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
          sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          {pdfPreview?.url && (
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <PDFViewer fileUrl={pdfPreview.url} initialPage={1} />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

/* ── Small helper for cover page detail rows ── */
function DetailRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <Stack direction="row" spacing={2} alignItems="baseline">
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 110 }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {value}
      </Typography>
    </Stack>
  );
}

export default HomeworkView;
