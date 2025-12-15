import React from 'react';
import { Typography } from '@mui/material';
import { Question } from '../../../../_lib/interfaces/types';
import QuestionTreeRenderer from '@/app/_lib/components/question/QuestionTreeRenderer';

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
  if (!question) {
    return (
      <Typography variant="body2" color="text.secondary">
        Add a question to see how it will appear to students.
      </Typography>
    );
  }

  const renderQuestion = (
    node: Question,
    numbering: string,
    depth: number = 1
  ): React.ReactNode => {
    const indent = depth > 1 ? (depth - 1) * 2 : 0;
    const textVariant = depth === 1 ? 'h6' : 'subtitle1';

    if (node.subquestions && node.subquestions.length > 0) {
      const sectionWeight = computeTotalWeight(node);
      return (
        <Box key={node.id} sx={{ my: 2, ml: indent }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              alignItems: 'baseline',
            }}
          >
            <Typography variant={textVariant} sx={{ fontWeight: 600 }}>
              {numbering}
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
          </Box>
          {node.type === 'video' && (
            <Box sx={{ mt: 2 }}>
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
            <Box
              sx={{
                mt: 2,
                height: 360,
                borderRadius: 1,
                overflow: 'hidden',
                border: 1,
                borderColor: 'divider',
              }}
            >
              {node.pdf?.url ? (
                <PDFViewer
                  key={node.pdf.key || node.id}
                  fileUrl={node.pdf.url}
                  initialPage={1}
                />
              ) : (
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 2,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Document unavailable
                  </Typography>
                </Box>
              )}
            </Box>
          )}
          {node.subquestions.map((sub, idx) =>
            renderQuestion(sub, `${numbering}.${idx + 1}`, depth + 1)
          )}
        </Box>
      );
    }

    const options = node.options ?? [];

    return (
      <Box key={node.id} sx={{ my: 2, ml: indent }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              alignItems: 'baseline',
            }}
          >
            <Typography variant={textVariant}>{numbering}</Typography>
            <QuestionTextDisplay
              content={node.questionText}
              fallback="Untitled question"
              variant={textVariant}
              component="span"
              sx={{ flex: 1, minWidth: 0 }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary">
            (Weight: {Number.isFinite(node.weight) ? node.weight : 0})
          </Typography>
        </Box>
        <Box sx={{ mt: 1 }}>
          {(() => {
            if (node.type === 'radio') {
              return (
                <RadioGroup value={node.correctAnswer ?? ''} row>
                  {options.length > 0 ? (
                    options.map((option, idx) => (
                      <FormControlLabel
                        key={idx}
                        value={option}
                        control={<Radio disabled />}
                        sx={{
                          '.MuiFormControlLabel-label': {
                            fontWeight:
                              (node.correctAnswer ?? '') === option
                                ? 600
                                : undefined,
                          },
                        }}
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
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {options.map((option, idx) => (
                    <FormControlLabel
                      key={idx}
                      control={
                        <Checkbox
                          disabled
                          checked={
                            Array.isArray(node.correctAnswers) &&
                            node.correctAnswers.includes(option)
                          }
                        />
                      }
                      sx={{
                        '.MuiFormControlLabel-label': {
                          fontWeight:
                            Array.isArray(node.correctAnswers) &&
                              node.correctAnswers.includes(option)
                              ? 600
                              : undefined,
                        },
                      }}
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
                <Typography variant="body2" color="text.secondary">
                  Video unavailable
                </Typography>
              );
            }

            if (node.type === 'pdf') {
              return node.pdf?.url ? (
                <Box
                  sx={{
                    mt: 1,
                    height: 360,
                    borderRadius: 1,
                    overflow: 'hidden',
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <PDFViewer
                    key={node.pdf.key || node.id}
                    fileUrl={node.pdf.url}
                    initialPage={1}
                  />
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
      </Box>
    );
  };

  const numberingLabel = questionNumber ?? (questionIndex + 1).toString();
  return <>{renderQuestion(question, numberingLabel)}</>;
};

export default QuestionPreviewPanel;
