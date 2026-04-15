import React from 'react';
import {
  Box,
  Chip,
  Checkbox,
  Paper,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, styled, Theme, useTheme } from '@mui/material/styles';
import { Question } from '../../../../_lib/interfaces/types';
import { VideoPlayer } from '@/app/_lib/components/video/VideoPlayer';
import PDFViewer from '@/app/_lib/components/PDFViewer/PDFViewer';
import QuestionTextDisplay from '@/app/_lib/components/TipTapEditor/QuestionTextDisplay';

type PreviewTone = 'question' | 'subquestion' | 'video' | 'pdf' | 'group';

type ToneStyle = {
  label: string;
  accentColor: string;
  borderColor: string;
  backgroundColor: string;
};

const getPreviewTone = (type: Question['type'], depth: number): PreviewTone => {
  if (type === 'pdf') return 'pdf';
  if (type === 'video') return 'video';
  if (type === 'group') return 'group';
  if (depth > 1) return 'subquestion';
  return 'question';
};

const getToneStyle = (theme: Theme, tone: PreviewTone): ToneStyle => {
  let label = 'Question';
  let accent = theme.palette.primary.main;

  if (tone === 'pdf') {
    label = 'PDF Section';
    accent = theme.palette.warning.main;
  } else if (tone === 'video') {
    label = 'Video Section';
    accent = theme.palette.info.main;
  } else if (tone === 'group') {
    label = 'Grouped Question';
    accent = theme.palette.secondary.main;
  } else if (tone === 'subquestion') {
    label = 'Subquestion';
    accent = theme.palette.text.secondary;
  }

  const strongOnDark = theme.palette.mode === 'dark' ? 0.42 : 0.3;
  const softOnDark = theme.palette.mode === 'dark' ? 0.2 : 0.08;

  return {
    label,
    accentColor: accent,
    borderColor: alpha(accent, strongOnDark),
    backgroundColor: alpha(accent, softOnDark),
  };
};

const EmptyPreviewPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: alpha(theme.palette.text.primary, theme.palette.mode === 'dark' ? 0.12 : 0.04),
}));

const IntroPaper = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: alpha(
    theme.palette.success.main,
    theme.palette.mode === 'dark' ? 0.2 : 0.08
  ),
  borderColor: alpha(
    theme.palette.success.main,
    theme.palette.mode === 'dark' ? 0.4 : 0.28
  ),
}));

const NodePaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'tone' && prop !== 'indentLevel',
})<{ tone: PreviewTone; indentLevel: number }>(({ theme, tone, indentLevel }) => {
  const toneStyle = getToneStyle(theme, tone);
  return {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginInlineStart: theme.spacing(indentLevel),
    borderRadius: Number(theme.shape.borderRadius) * 2,
    borderColor: toneStyle.borderColor,
    borderLeft: `6px solid ${toneStyle.borderColor}`,
    backgroundColor: toneStyle.backgroundColor,
    padding: theme.spacing(2),
  };
});

const HeaderMeta = styled(Stack)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
}));

const PromptRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  alignItems: 'baseline',
}));

const PromptColumn = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

const ToneChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: PreviewTone }>(({ theme, tone }) => {
  const toneStyle = getToneStyle(theme, tone);
  return {
    fontWeight: 600,
    color: toneStyle.accentColor,
    backgroundColor: alpha(
      toneStyle.accentColor,
      theme.palette.mode === 'dark' ? 0.26 : 0.12
    ),
    borderColor: alpha(
      toneStyle.accentColor,
      theme.palette.mode === 'dark' ? 0.48 : 0.32
    ),
  };
});

const QuestionNumber = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: PreviewTone }>(({ theme, tone }) => {
  const toneStyle = getToneStyle(theme, tone);
  return {
    fontWeight: 700,
    color: toneStyle.accentColor,
  };
});

const PdfContainer = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: Number(theme.shape.borderRadius) * 2,
}));

const PdfFrame = styled(Box)(({ theme }) => ({
  height: 360,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  border: `1px solid ${alpha(theme.palette.warning.main, theme.palette.mode === 'dark' ? 0.55 : 0.35)}`,
  backgroundColor: theme.palette.background.paper,
}));

const OptionLabel = styled(FormControlLabel, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ theme, selected }) => {
  const selectedOpacity = theme.palette.mode === 'dark' ? 0.28 : 0.14;
  return {
    margin: 0,
    paddingInline: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: selected
      ? alpha(theme.palette.success.main, selectedOpacity)
      : 'transparent',
    '& .MuiFormControlLabel-label': {
      fontWeight: selected ? 600 : undefined,
      color: theme.palette.text.primary,
    },
  };
});

const CenterFallback = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingInline: theme.spacing(2),
  textAlign: 'center',
}));

const OptionsColumn = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

interface QuestionPreviewPanelProps {
  question?: Question;
  questionIndex: number;
  questionNumber?: string;
  computeTotalWeight: (question: Question) => number;
}

const QuestionPreviewPanel: React.FC<QuestionPreviewPanelProps> = ({
  question,
  questionIndex,
  questionNumber,
  computeTotalWeight,
}) => {
  const theme = useTheme();

  if (!question) {
    return (
      <EmptyPreviewPaper variant="outlined">
        <Typography variant="body2" color="text.secondary">
          Add a question to see how it will appear to students.
        </Typography>
      </EmptyPreviewPaper>
    );
  }

  const renderQuestion = (
    node: Question,
    numbering: string,
    depth: number = 1
  ): React.ReactNode => {
    const indent = depth > 1 ? (depth - 1) * 2 : 0;
    const textVariant = depth === 1 ? 'h6' : 'subtitle1';
    const tone = getPreviewTone(node.type, depth);
    const toneStyle = getToneStyle(theme, tone);

    if (node.subquestions && node.subquestions.length > 0) {
      const sectionWeight = computeTotalWeight(node);
      return (
        <NodePaper
          key={node.id}
          variant="outlined"
          tone={tone}
          indentLevel={indent}
        >
          <HeaderMeta
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
          >
            <Chip size="small" label="Student Preview" color="success" variant="filled" />
            <ToneChip size="small" label={toneStyle.label} tone={tone} variant="outlined" />
          </HeaderMeta>
          <PromptRow>
            <QuestionNumber variant={textVariant} tone={tone}>
              {`Q ${numbering}`}
            </QuestionNumber>
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
                Total Weight: {sectionWeight}
              </Typography>
            )}
          </PromptRow>
          {node.type === 'video' && (
            <Box mt={2}>
              {node.video ? (
                <VideoPlayer video={node.video} />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Video unavailable
                </Typography>
              )}
            </Box>
          )}
          {node.type === 'pdf' && (
            <PdfContainer variant="outlined">
              <Typography variant="subtitle2" mb={1} fontWeight={600} color="text.primary">
                Reference PDF for this section
              </Typography>
              <PdfFrame>
              {node.pdf?.url ? (
                <PDFViewer
                  key={node.pdf.key || node.id}
                  fileUrl={node.pdf.url}
                  initialPage={1}
                />
              ) : (
                <CenterFallback>
                  <Typography variant="body2" color="text.secondary">
                    Document unavailable
                  </Typography>
                </CenterFallback>
              )}
              </PdfFrame>
            </PdfContainer>
          )}
          {node.subquestions.map((sub, idx) =>
            renderQuestion(sub, `${numbering}.${idx + 1}`, depth + 1)
          )}
        </NodePaper>
      );
    }

    const options = node.options ?? [];

    return (
      <NodePaper
        key={node.id}
        variant="outlined"
        tone={tone}
        indentLevel={indent}
      >
        <HeaderMeta
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <Chip size="small" label="Student Preview" color="success" variant="filled" />
          <ToneChip size="small" label={toneStyle.label} tone={tone} variant="outlined" />
        </HeaderMeta>
        <PromptColumn>
          <PromptRow>
            <QuestionNumber variant={textVariant} tone={tone}>
              {`Q ${numbering}`}
            </QuestionNumber>
            <QuestionTextDisplay
              content={node.questionText}
              fallback="Untitled question"
              variant={textVariant}
              component="span"
              sx={{ flex: 1, minWidth: 0 }}
            />
          </PromptRow>
          <Typography variant="caption" color="text.secondary">
            Weight: {Number.isFinite(node.weight) ? node.weight : 0}
          </Typography>
        </PromptColumn>
        <Box mt={1}>
          {(() => {
            if (node.type === 'single-select') {
              return (
                <RadioGroup value={node.correctAnswer ?? ''} row>
                  {options.length > 0 ? (
                    options.map((option, idx) => (
                      <OptionLabel
                        key={`${node.id}-single-${option}-${idx}`}
                        value={option}
                        control={<Radio disabled />}
                        selected={(node.correctAnswer ?? '') === option}
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
                <OptionsColumn>
                  {options.map((option, idx) => (
                    <OptionLabel
                      key={`${node.id}-multi-${option}-${idx}`}
                      control={
                        <Checkbox
                          disabled
                          checked={
                            Array.isArray(node.correctAnswers) &&
                            node.correctAnswers.includes(option)
                          }
                        />
                      }
                      selected={
                        Array.isArray(node.correctAnswers) &&
                        node.correctAnswers.includes(option)
                      }
                      label={option || `Option ${idx + 1}`}
                    />
                  ))}
                </OptionsColumn>
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
              return node.pdf?.url ? (
                <Box mt={1}>
                  <PdfFrame>
                    <PDFViewer
                      key={node.pdf.key || node.id}
                      fileUrl={node.pdf.url}
                      initialPage={1}
                    />
                  </PdfFrame>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Document unavailable
                </Typography>
              );
            }

            return (
              <Typography variant="body2" color="text.secondary">
                Unsupported question type
              </Typography>
            );
          })()}
        </Box>
      </NodePaper>
    );
  };

  const numberingLabel = questionNumber ?? (questionIndex + 1).toString();
  return (
    <Box>
      <IntroPaper variant="outlined">
        <Typography variant="subtitle2" fontWeight={700} color="text.primary">
          Student-facing Preview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This is what learners will see for the selected question.
        </Typography>
      </IntroPaper>
      {renderQuestion(question, numberingLabel)}
    </Box>
  );
};

export default QuestionPreviewPanel;
