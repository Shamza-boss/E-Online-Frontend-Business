import React, { useState } from 'react';
import { NextPage } from 'next';
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Slide,
  TextField,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { TransitionProps } from '@mui/material/transitions';
import { Homework, Question } from '../../../../_lib/interfaces/types';
import { v4 as uuidv4 } from 'uuid';
import { VideoUploadField } from '@/app/_lib/components/video/VideoUploadField';

interface FormBuilderModalProps {
  open: boolean;
  onClose: () => void;
  onPublish: (homework: Homework) => void;
}

const QUESTION_TYPES = [
  { value: 'video', label: 'Video Section' },
  { value: 'radio', label: 'Single Choice' },
  { value: 'multi-select', label: 'Multiple Choice' },
];

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FormBuilderModal: NextPage<FormBuilderModalProps> = ({
  open,
  onClose,
  onPublish,
}) => {
  const [formTitle, setFormTitle] = useState('');
  const [description, setDescription] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  // Compute total weight from subquestions (if any)
  const computeTotalWeight = (question: Question): number => {
    if (question.subquestions && question.subquestions.length > 0) {
      return question.subquestions.reduce(
        (total, sub) => total + sub.weight,
        0
      );
    }
    return question.weight;
  };

  // Create a new top-level question.
  const addQuestion = () => {
    const newQuestion: Question = {
      id: uuidv4(),
      questionText: '',
      type: 'video',
      options: [],
      required: false,
      weight: 0,
      subquestions: [],
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, key: keyof Question, value: any) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [key]: value } : q))
    );
  };

  const addOptionToQuestion = (questionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return { ...q, options: q.options ? [...q.options, ''] : [''] };
        }
        return q;
      })
    );
  };

  const updateOption = (questionId: string, index: number, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId && q.options) {
          const newOptions = [...q.options];
          newOptions[index] = value;
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // Subquestion functions
  const addSubquestion = (parentId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === parentId) {
          const newSubquestion: Question = {
            id: uuidv4(),
            questionText: '',
            type: 'radio',
            options: [],
            required: false,
            weight: 0,
            subquestions: [],
          };
          const updatedSubquestions = q.subquestions
            ? [...q.subquestions, newSubquestion]
            : [newSubquestion];
          return { ...q, subquestions: updatedSubquestions };
        }
        return q;
      })
    );
  };

  const updateSubquestion = (
    parentId: string,
    subId: string,
    key: keyof Question,
    value: any
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === parentId && q.subquestions) {
          const updatedSubs = q.subquestions.map((sub) =>
            sub.id === subId ? { ...sub, [key]: value } : sub
          );
          return { ...q, subquestions: updatedSubs };
        }
        return q;
      })
    );
  };

  const removeSubquestion = (parentId: string, subId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === parentId && q.subquestions) {
          const updatedSubs = q.subquestions.filter((sub) => sub.id !== subId);
          return { ...q, subquestions: updatedSubs };
        }
        return q;
      })
    );
  };

  const addOptionToSubquestion = (parentId: string, subId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === parentId && q.subquestions) {
          const updatedSubs = q.subquestions.map((sub) => {
            if (sub.id === subId) {
              return {
                ...sub,
                options: sub.options ? [...sub.options, ''] : [''],
              };
            }
            return sub;
          });
          return { ...q, subquestions: updatedSubs };
        }
        return q;
      })
    );
  };

  const updateSubquestionOption = (
    parentId: string,
    subId: string,
    index: number,
    value: string
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === parentId && q.subquestions) {
          const updatedSubs = q.subquestions.map((sub) => {
            if (sub.id === subId && sub.options) {
              const newOptions = [...sub.options];
              newOptions[index] = value;
              return { ...sub, options: newOptions };
            }
            return sub;
          });
          return { ...q, subquestions: updatedSubs };
        }
        return q;
      })
    );
  };

  const handlePublish = () => {
    const homework: Homework = {
      title: formTitle,
      description,
      publishDate,
      dueDate,
      questions,
    };
    onPublish(homework);
    onClose();
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      slots={{ transition: Transition }}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ flex: 1 }} variant="h6">
            Create module
          </Typography>
          <Button autoFocus color="inherit" onClick={handlePublish}>
            Publish module
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2, m: 2 }}>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Publish Date"
          type="date"
          fullWidth
          margin="normal"
          slotProps={{ inputLabel: { shrink: true } }}
          value={publishDate}
          onChange={(e) => setPublishDate(e.target.value)}
        />
        <TextField
          label="Due Date"
          type="date"
          fullWidth
          margin="normal"
          slotProps={{ inputLabel: { shrink: true } }}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <Paper sx={{ p: 1, mt: 2, mb: 2 }}>
          <Typography variant="h6">Create questions below</Typography>
        </Paper>
        {questions.map((q, qIdx) => (
          <Paper key={q.id} sx={{ p: 2, mb: 1 }}>
            <Typography variant="subtitle1">
              {q.subquestions && q.subquestions.length > 0
                ? `Section ${qIdx + 1} (Total Weight: ${computeTotalWeight(q)})`
                : `Question ${qIdx + 1}`}
            </Typography>
            {q.type === 'video' ? (
              <Box>
                <TextField
                  label="Section Title"
                  fullWidth
                  margin="normal"
                  value={q.questionText}
                  onChange={(e) =>
                    updateQuestion(q.id, 'questionText', e.target.value)
                  }
                />
                <VideoUploadField
                  value={q.video}
                  onChange={(video) => updateQuestion(q.id, 'video', video)}
                />
              </Box>
            ) : (
              <TextField
                label="Question Text"
                fullWidth
                margin="normal"
                value={q.questionText}
                onChange={(e) =>
                  updateQuestion(q.id, 'questionText', e.target.value)
                }
              />
            )}
            {/* Only show type and weight controls for non-video questions or video questions without subquestions */}
            {q.type !== 'video' ||
            !(q.subquestions && q.subquestions.length > 0) ? (
              <>
                <Stack direction={'row'} spacing={1}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={q.type}
                      onChange={(e) =>
                        updateQuestion(q.id, 'type', e.target.value)
                      }
                      label="Type"
                    >
                      {QUESTION_TYPES.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {q.type !== 'video' && (
                    <TextField
                      label="Weight"
                      type="number"
                      fullWidth
                      margin="normal"
                      value={q.weight}
                      onChange={(e) =>
                        updateQuestion(q.id, 'weight', Number(e.target.value))
                      }
                    />
                  )}
                </Stack>
                {['radio', 'multi-select'].includes(q.type) && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle1">Options</Typography>
                    {q.options?.map((option, optIdx) => (
                      <TextField
                        key={optIdx}
                        label={`Option ${optIdx + 1}`}
                        fullWidth
                        margin="normal"
                        value={option}
                        onChange={(e) =>
                          updateOption(q.id, optIdx, e.target.value)
                        }
                      />
                    ))}
                    <Button onClick={() => addOptionToQuestion(q.id)}>
                      Add Option
                    </Button>
                  </Box>
                )}
                <Stack mt={2} spacing={1} direction={'row'}>
                  {q.type === 'video' && (
                    <Button
                      variant="outlined"
                      sx={{ mt: 1 }}
                      onClick={() => addSubquestion(q.id)}
                    >
                      Add Question to Video Section
                    </Button>
                  )}
                  {q.type !== 'video' && (
                    <Button
                      variant="outlined"
                      sx={{ mt: 1 }}
                      onClick={() => addSubquestion(q.id)}
                    >
                      Change to subquestion
                    </Button>
                  )}
                  <Box flexGrow={1} />
                  <IconButton onClick={() => removeQuestion(q.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </>
            ) : null}
            {q.subquestions && q.subquestions.length > 0 && (
              <Box sx={{ ml: 0.5, borderLeft: '2px solid #ccc', pl: 1 }}>
                {q.subquestions.map((sub, subIdx) => (
                  <Paper key={sub.id} sx={{ mb: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="subtitle2">
                        Question {qIdx + 1}.{subIdx + 1}
                      </Typography>
                    </Box>
                    <TextField
                      label="Subquestion Text"
                      fullWidth
                      margin="normal"
                      value={sub.questionText}
                      onChange={(e) =>
                        updateSubquestion(
                          q.id,
                          sub.id,
                          'questionText',
                          e.target.value
                        )
                      }
                    />
                    <Stack spacing={2} direction={'row'}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Type</InputLabel>
                        <Select
                          value={sub.type}
                          onChange={(e) =>
                            updateSubquestion(
                              q.id,
                              sub.id,
                              'type',
                              e.target.value
                            )
                          }
                          label="Type"
                        >
                          {QUESTION_TYPES.filter(
                            (type) => type.value !== 'video'
                          ).map((type) => (
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
                        onChange={(e) =>
                          updateSubquestion(
                            q.id,
                            sub.id,
                            'weight',
                            Number(e.target.value)
                          )
                        }
                      />
                    </Stack>

                    {['radio', 'multi-select'].includes(sub.type) && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="subtitle1">Options</Typography>
                        {sub.options?.map((option, optIdx) => (
                          <TextField
                            key={optIdx}
                            label={`Option ${optIdx + 1}`}
                            fullWidth
                            margin="normal"
                            value={option}
                            onChange={(e) =>
                              updateSubquestionOption(
                                q.id,
                                sub.id,
                                optIdx,
                                e.target.value
                              )
                            }
                          />
                        ))}
                        <Button
                          onClick={() => addOptionToSubquestion(q.id, sub.id)}
                        >
                          Add Option
                        </Button>
                      </Box>
                    )}

                    <Stack direction={'row'} spacing={1} mt={2.5}>
                      <Button
                        variant="outlined"
                        onClick={() => addSubquestion(q.id)}
                      >
                        Add Subquestion
                      </Button>
                      <Box flexGrow={1} />
                      <IconButton
                        onClick={() => removeSubquestion(q.id, sub.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Paper>
                ))}
              </Box>
            )}
          </Paper>
        ))}
        <Button variant="contained" onClick={addQuestion} sx={{ mr: 1 }}>
          Add Question
        </Button>
      </Box>
    </Dialog>
  );
};

export default FormBuilderModal;
