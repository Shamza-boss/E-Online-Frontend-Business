import React from 'react';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Question } from '../../../../_lib/interfaces/types';
import { VideoUploadField } from '@/app/_lib/components/video/VideoUploadField';
import { isChoiceType } from './questionUtils';

interface QuestionEditorPanelProps {
  question?: Question;
  questionIndex: number;
  questionTypeOptions: ReadonlyArray<{
    value: Question['type'];
    label: string;
  }>;
  computeTotalWeight: (question: Question) => number;
  onFieldChange: (questionId: string, key: keyof Question, value: any) => void;
  onTypeChange: (questionId: string, newType: Question['type']) => void;
  onWeightChange: (questionId: string, value: string) => void;
  onAddOption: (questionId: string) => void;
  onOptionChange: (questionId: string, index: number, value: string) => void;
  onAddSubquestion: (parentId: string) => void;
  onRemoveSubquestion: (parentId: string, subId: string) => void;
  onRemoveQuestion: (questionId: string) => void;
}

const QuestionEditorPanel: React.FC<QuestionEditorPanelProps> = ({
  question,
  questionIndex,
  questionTypeOptions,
  computeTotalWeight,
  onFieldChange,
  onTypeChange,
  onWeightChange,
  onAddOption,
  onOptionChange,
  onAddSubquestion,
  onRemoveSubquestion,
  onRemoveQuestion,
}) => {
  if (!question) {
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No questions yet. Click &ldquo;Add Question&rdquo; to start building
          your module.
        </Typography>
      </Paper>
    );
  }

  const renderSubquestion = (
    sub: Question,
    numbering: string,
    depth: number,
    parentId: string
  ): React.ReactNode => {
    const isLeaf = !sub.subquestions || sub.subquestions.length === 0;

    return (
      <Paper key={sub.id} sx={{ mb: 1.5, mt: 1, p: 1.5 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Question {numbering}
        </Typography>
        <TextField
          label={depth === 1 ? 'Subquestion Text' : 'Nested Question Text'}
          fullWidth
          margin="normal"
          value={sub.questionText}
          onChange={(e) =>
            onFieldChange(sub.id, 'questionText', e.target.value)
          }
        />
        <Stack spacing={2} direction="row">
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              value={sub.type}
              label="Type"
              onChange={(e) =>
                onTypeChange(sub.id, e.target.value as Question['type'])
              }
            >
              {questionTypeOptions
                .filter((type) => type.value !== 'video')
                .map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <TextField
            label="Weight"
            type="number"
            fullWidth
            margin="normal"
            value={sub.weight}
            onChange={(e) => onWeightChange(sub.id, e.target.value)}
          />
        </Stack>

        {isLeaf && isChoiceType(sub.type) && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2">Options</Typography>
            {sub.options?.map((option, index) => (
              <TextField
                key={index}
                label={`Option ${index + 1}`}
                fullWidth
                margin="normal"
                value={option}
                onChange={(e) => onOptionChange(sub.id, index, e.target.value)}
              />
            ))}
            <Button onClick={() => onAddOption(sub.id)}>Add Option</Button>
          </Box>
        )}

        {sub.subquestions && sub.subquestions.length > 0 && depth < 2 && (
          <Box sx={{ borderLeft: '2px solid #ddd', pl: 2, mt: 1 }}>
            {sub.subquestions.map((nested, nestedIdx) =>
              renderSubquestion(
                nested,
                `${numbering}.${nestedIdx + 1}`,
                depth + 1,
                sub.id
              )
            )}
          </Box>
        )}

        <Stack direction="row" spacing={1} mt={2} alignItems="center">
          {depth === 1 && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => onAddSubquestion(sub.id)}
            >
              Add Nested Question
            </Button>
          )}
          <Box flexGrow={1} />
          <IconButton onClick={() => onRemoveSubquestion(parentId, sub.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Paper>
    );
  };

  const isVideo = question.type === 'video';
  const hasSubquestions =
    question.subquestions && question.subquestions.length > 0;
  const showTypeControls = question.type !== 'video' || !hasSubquestions;

  return (
    <Paper key={question.id} sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle1">
        {isVideo && hasSubquestions
          ? `Section ${questionIndex + 1} (Total Weight: ${computeTotalWeight(question)})`
          : `Question ${questionIndex + 1}`}
      </Typography>
      {isVideo ? (
        <>
          <TextField
            label="Section Title"
            fullWidth
            margin="normal"
            value={question.questionText}
            onChange={(e) =>
              onFieldChange(question.id, 'questionText', e.target.value)
            }
          />
          <VideoUploadField
            value={question.video}
            onChange={(video) => onFieldChange(question.id, 'video', video)}
          />
        </>
      ) : (
        <TextField
          label="Question Text"
          fullWidth
          margin="normal"
          value={question.questionText}
          onChange={(e) =>
            onFieldChange(question.id, 'questionText', e.target.value)
          }
        />
      )}

      {showTypeControls && (
        <>
          <Stack direction="row" spacing={1}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select
                value={question.type}
                label="Type"
                onChange={(e) =>
                  onTypeChange(question.id, e.target.value as Question['type'])
                }
              >
                {questionTypeOptions.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {question.type !== 'video' && (
              <TextField
                label="Weight"
                type="number"
                fullWidth
                margin="normal"
                value={question.weight}
                onChange={(e) => onWeightChange(question.id, e.target.value)}
              />
            )}
          </Stack>

          {isChoiceType(question.type) && !hasSubquestions && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle1">Options</Typography>
              {question.options?.map((option, index) => (
                <TextField
                  key={index}
                  label={`Option ${index + 1}`}
                  fullWidth
                  margin="normal"
                  value={option}
                  onChange={(e) =>
                    onOptionChange(question.id, index, e.target.value)
                  }
                />
              ))}
              <Button onClick={() => onAddOption(question.id)}>
                Add Option
              </Button>
            </Box>
          )}
        </>
      )}

      <Stack direction="row" spacing={1} mt={2} alignItems="center">
        {question.type === 'video' && (
          <Button
            variant="outlined"
            onClick={() => onAddSubquestion(question.id)}
          >
            Add Question to Video Section
          </Button>
        )}
        <Box flexGrow={1} />
        <IconButton onClick={() => onRemoveQuestion(question.id)}>
          <DeleteIcon />
        </IconButton>
      </Stack>

      {question.subquestions && question.subquestions.length > 0 && (
        <Box sx={{ ml: 0.5, borderLeft: '2px solid #ccc', pl: 1, mt: 2 }}>
          {question.subquestions.map((sub, idx) =>
            renderSubquestion(
              sub,
              `${questionIndex + 1}.${idx + 1}`,
              1,
              question.id
            )
          )}
          <Button
            sx={{ mt: 1 }}
            size="small"
            onClick={() => onAddSubquestion(question.id)}
          >
            Add Another Question to Section
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default QuestionEditorPanel;
