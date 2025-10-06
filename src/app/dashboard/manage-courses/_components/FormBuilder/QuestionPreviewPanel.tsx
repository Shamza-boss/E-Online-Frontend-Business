import React from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { Question } from '../../../../_lib/interfaces/types';
import { VideoPlayer } from '@/app/_lib/components/video/VideoPlayer';

interface QuestionPreviewPanelProps {
  question?: Question;
  questionIndex: number;
  computeTotalWeight: (question: Question) => number;
}

const QuestionPreviewPanel: React.FC<QuestionPreviewPanelProps> = ({
  question,
  questionIndex,
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
          <Typography variant={textVariant} sx={{ fontWeight: 600 }}>
            {numbering}. {node.questionText || 'Untitled section'}
            {sectionWeight > 0 ? ` (Total Weight: ${sectionWeight})` : ''}
          </Typography>
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
          <Typography variant={textVariant}>
            {numbering}. {node.questionText || 'Untitled question'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            (Weight: {Number.isFinite(node.weight) ? node.weight : 0})
          </Typography>
        </Box>
        <Box sx={{ mt: 1 }}>
          {(() => {
            if (node.type === 'radio') {
              return (
                <RadioGroup value="" row>
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
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {options.map((option, idx) => (
                    <FormControlLabel
                      key={idx}
                      control={<Checkbox disabled />}
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

  return <>{renderQuestion(question, (questionIndex + 1).toString())}</>;
};

export default QuestionPreviewPanel;
