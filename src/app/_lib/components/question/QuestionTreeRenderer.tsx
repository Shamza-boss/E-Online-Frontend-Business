'use client';

import React from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { Question } from '../../interfaces/types';
import QuestionTextDisplay from '../TipTapEditor/QuestionTextDisplay';
import { VideoPlayer } from '../video/VideoPlayer';
import PDFViewer from '../PDFViewer/PDFViewer';

type AnswersMap = Record<string, any>;

type GradingEntry = {
  grade?: number;
  comment?: string;
};

type GradingMap = Record<string, GradingEntry | undefined>;

type QuestionTreeMode =
  | 'builder-preview'
  | 'student'
  | 'review'
  | 'graded';

interface QuestionTreeRendererProps {
  question: Question;
  questionIndex: number;
  mode: QuestionTreeMode;
  computeTotalWeight?: (question: Question) => number;
  answers?: AnswersMap;
  onAnswerChange?: (questionId: string, value: any) => void;
  readOnly?: boolean;
  renderPdfAttachment?: (
    title: string,
    pdf?: Question['pdf'],
    options?: { compact?: boolean }
  ) => React.ReactNode;
  grading?: GradingMap;
  computeSectionTotals?: (
    question: Question,
    grading: GradingMap
  ) => { awarded: number; estimated: number };
  getGradeBorder?: (award: number, weight: number) => string;
}

const stripHtml = (html?: string | null) =>
  (html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const defaultPdfFallback = (
  question: Question,
  isSection: boolean
): React.ReactNode => {
  if (!question.pdf?.url) {
    return (
      <Typography variant="body2" color="text.secondary">
        Document unavailable
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        height: 360,
        borderRadius: 1,
        overflow: 'hidden',
        border: 1,
        borderColor: 'divider',
      }}
    >
      <PDFViewer
        key={question.pdf.key || question.id}
        fileUrl={question.pdf.url}
        initialPage={1}
      />
    </Box>
  );
};

const QuestionTreeRenderer: React.FC<QuestionTreeRendererProps> = ({
  question,
  questionIndex,
  mode,
  computeTotalWeight,
  answers = {},
  onAnswerChange,
  readOnly = false,
  renderPdfAttachment,
  grading = {},
  computeSectionTotals,
  getGradeBorder,
}) => {
  const indentStep = mode === 'graded' ? 5 : 2;

  const resolveGradeColor = (award: number, weight: number) => {
    if (!getGradeBorder) return 'divider';
    return getGradeBorder(award, weight);
  };

  const renderNode = (
    node: Question,
    numbering: string,
    depth: number
  ): React.ReactNode => {
    const isSection = Array.isArray(node.subquestions) && node.subquestions.length > 0;
    const indent = depth > 1 ? (depth - 1) * indentStep : 0;
    const textVariant = mode === 'graded' ? 'h6' : depth === 1 ? 'h6' : 'subtitle1';
    const weightValue = Number.isFinite(node.weight) ? Number(node.weight) : 0;

    const sectionWeight =
      isSection && computeTotalWeight ? computeTotalWeight(node) : undefined;

    const sectionTotals =
      mode === 'graded' && isSection && computeSectionTotals
        ? computeSectionTotals(node, grading)
        : null;

    const sectionGradeInfo = mode === 'graded' ? grading[node.id] : undefined;

    const header = (
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          alignItems: 'baseline',
        }}
      >
        <Typography
          variant={textVariant}
          sx={{ fontWeight: mode === 'graded' || depth === 1 ? 600 : undefined }}
        >
          {numbering}.
        </Typography>
        <QuestionTextDisplay
          content={node.questionText}
          fallback={isSection ? 'Untitled section' : 'Untitled question'}
          variant={textVariant}
          component="span"
          fontWeight={mode === 'graded' || depth === 1 ? 600 : undefined}
          sx={{ flex: 1, minWidth: 0 }}
          showExcalidrawModalTrigger={mode !== 'builder-preview'}
        />
        {isSection ? (
          sectionWeight && sectionWeight > 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              component="span"
            >
              (Total Weight: {sectionWeight})
            </Typography>
          ) : null
        ) : (
          <Typography variant="caption" color="text.secondary">
            (Weight: {weightValue})
          </Typography>
        )}
      </Box>
    );

    const renderVideo = () =>
      node.video ? (
        <VideoPlayer video={node.video} />
      ) : (
        <Typography variant="body2" color="text.secondary">
          Video unavailable
        </Typography>
      );

    const renderPdf = (compact: boolean) => {
      const plainTitle =
        stripHtml(node.questionText) || (isSection ? 'PDF section' : 'PDF question');

      if (renderPdfAttachment) {
        return (
          renderPdfAttachment(plainTitle, node.pdf, { compact }) ??
          defaultPdfFallback(node, isSection)
        );
      }

      return defaultPdfFallback(node, isSection);
    };

    const renderChoiceOptions = () => {
      const options = node.options ?? [];
      if (!options.length) {
        return (
          <Typography variant="body2" color="text.secondary">
            Options will appear here
          </Typography>
        );
      }

      if (node.type === 'single-select') {
        const selectedValue = (() => {
          if (mode === 'builder-preview') return node.correctAnswer ?? '';
          const answer = answers[node.id];
          return typeof answer === 'string' ? answer : '';
        })();

        const disableInputs =
          mode !== 'student' || readOnly || typeof onAnswerChange !== 'function';

        return (
          <RadioGroup
            value={selectedValue}
            row
            onChange={(event) => {
              if (disableInputs) return;
              onAnswerChange?.(node.id, event.target.value);
            }}
          >
            {options.map((option, idx) => {
              const isHighlighted = (() => {
                if (mode === 'builder-preview') {
                  return (node.correctAnswer ?? '') === option;
                }
                return selectedValue === option && mode !== 'student';
              })();

              return (
                <FormControlLabel
                  key={idx}
                  value={option}
                  control={<Radio disabled={disableInputs} />}
                  sx={{
                    '.MuiFormControlLabel-label': {
                      fontWeight: isHighlighted ? 600 : undefined,
                    },
                  }}
                  label={option || `Option ${idx + 1}`}
                />
              );
            })}
          </RadioGroup>
        );
      }

      if (node.type === 'multi-select') {
        const baseValues = (() => {
          if (mode === 'builder-preview') {
            return Array.isArray(node.correctAnswers) ? node.correctAnswers : [];
          }
          const answer = answers[node.id];
          return Array.isArray(answer) ? (answer as string[]) : [];
        })();

        const disableInputs =
          mode !== 'student' || readOnly || typeof onAnswerChange !== 'function';

        const handleToggle = (option: string, checked: boolean) => {
          if (disableInputs) return;
          const previous = Array.isArray(answers[node.id])
            ? (answers[node.id] as string[])
            : [];
          const next = checked
            ? Array.from(new Set([...previous, option]))
            : previous.filter((value) => value !== option);
          onAnswerChange?.(node.id, next);
        };

        return (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {options.map((option, idx) => {
              const isChecked = baseValues.includes(option);
              const highlight =
                mode === 'builder-preview'
                  ? (node.correctAnswers ?? []).includes(option)
                  : mode !== 'student' && isChecked;

              return (
                <FormControlLabel
                  key={idx}
                  control={
                    <Checkbox
                      disabled={disableInputs}
                      checked={isChecked}
                      onChange={(event) =>
                        handleToggle(option, event.target.checked)
                      }
                    />
                  }
                  sx={{
                    '.MuiFormControlLabel-label': {
                      fontWeight: highlight ? 600 : undefined,
                    },
                  }}
                  label={option || `Option ${idx + 1}`}
                />
              );
            })}
          </Box>
        );
      }

      return (
        <Typography variant="body2" color="text.secondary">
          Unsupported question type
        </Typography>
      );
    };

    const bodyContent = (() => {
      if (node.type === 'video') {
        return renderVideo();
      }
      if (node.type === 'pdf') {
        return renderPdf(!isSection);
      }
      if (node.type === 'single-select' || node.type === 'multi-select') {
        return renderChoiceOptions();
      }

      return (
        <Typography variant="body2" color="text.secondary">
          Unsupported question type
        </Typography>
      );
    })();

    const children = isSection
      ? node.subquestions?.map((sub, idx) =>
          renderNode(sub, `${numbering}.${idx + 1}`, depth + 1)
        ) ?? []
      : null;

    return (
      <Box key={node.id} sx={{ my: 2, ml: indent }}>
        {header}

        <Box sx={{ mt: isSection ? 2 : 1 }}>
          {mode === 'graded' && !isSection ? (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 3 }}>{bodyContent}</Box>
              <Box
                sx={{
                  flex: 1,
                  p: 1,
                  border: 2,
                  borderColor: resolveGradeColor(
                    grading[node.id]?.grade ?? 0,
                    weightValue
                  ),
                  borderRadius: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {grading[node.id]?.grade ?? 0} / {weightValue}
                </Typography>
                {grading[node.id]?.comment && (
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      textAlign: 'center',
                      color:
                        (grading[node.id]?.grade ?? 0) < weightValue
                          ? resolveGradeColor(
                              grading[node.id]?.grade ?? 0,
                              weightValue
                            )
                          : 'inherit',
                    }}
                  >
                    {grading[node.id]?.comment}
                  </Typography>
                )}
              </Box>
            </Box>
          ) : (
            bodyContent
          )}
        </Box>

        {children}

        {mode === 'graded' && isSection && sectionTotals && (
          <Box sx={{ mt: 1, ml: 6 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 'bold',
                color:
                  sectionTotals.awarded < sectionTotals.estimated
                    ? resolveGradeColor(
                        sectionTotals.awarded,
                        sectionTotals.estimated
                      )
                    : 'inherit',
              }}
            >
              Section Total: {sectionTotals.awarded} / {sectionTotals.estimated}
            </Typography>
            {sectionGradeInfo?.comment && (
              <Typography
                variant="body2"
                sx={{
                  mt: 0.5,
                  color:
                    (sectionTotals?.awarded ?? 0) <
                    (sectionTotals?.estimated ?? 0)
                      ? resolveGradeColor(
                          sectionTotals?.awarded ?? 0,
                          sectionTotals?.estimated ?? 0
                        )
                      : 'inherit',
                }}
              >
                Section Comment: {sectionGradeInfo.comment}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    );
  };

  return <>{renderNode(question, (questionIndex + 1).toString(), 1)}</>;
};

export default QuestionTreeRenderer;
