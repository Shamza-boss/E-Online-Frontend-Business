'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Question } from '../../../../_lib/interfaces/types';
import { VideoUploadField } from '@/app/_lib/components/video/VideoUploadField';
import { PdfUploadField } from '@/app/_lib/components/pdf/PdfUploadField';
import { isChoiceType, IsValidChild, NEW_QUESTION_DND_MIME } from './questionUtils';
import { RichTextEditor, RichTextEditorRef } from 'mui-tiptap';
import useExtensions from '@/app/_lib/components/TipTapEditor/useExtensions';
import EditorMenuControls from '@/app/_lib/components/TipTapEditor/EditorMenuControls';

const SUBQUESTION_DND_MIME = 'application/x-eonline-subquestion-move';

const isSectionType = (type: Question['type']) =>
  type === 'video' || type === 'pdf' || type === 'group';

const allowedTypeHint = (parentType: Question['type']) => {
  if (parentType === 'video' || parentType === 'pdf') {
    return 'Single Choice or Multiple Choice';
  }
  if (parentType === 'group') {
    return 'Video Section, PDF Section, Single Choice, or Multiple Choice';
  }
  return '';
};

interface QuestionRichTextFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  minHeight?: number;
  showToolbar?: boolean;
}

const QuestionRichTextField: React.FC<QuestionRichTextFieldProps> = ({
  label,
  value,
  placeholder,
  onChange,
  minHeight = 180,
  showToolbar = true,
}) => {
  const fieldId = useId();
  const editorRef = useRef<RichTextEditorRef>(null);
  const extensions = useExtensions({ placeholder });
  const normalizedValue = value ?? '';

  useEffect(() => {
    const editor = editorRef.current?.editor;
    if (!editor) return;

    if (!normalizedValue) {
      if (!editor.isEmpty) {
        editor.commands.clearContent();
      }
      return;
    }

    if (editor.getHTML() !== normalizedValue) {
      editor.commands.setContent(normalizedValue, false);
    }
  }, [normalizedValue]);

  const handleUpdate = () => {
    const editor = editorRef.current?.editor;
    if (!editor) return;

    const html = editor.isEmpty ? '' : editor.getHTML();
    if (html !== normalizedValue) {
      onChange(html);
    }
  };

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel
        shrink
        htmlFor={fieldId}
        sx={{ position: 'relative', transform: 'none', mb: 0.5 }}
      >
        {label}
      </InputLabel>
      <RichTextEditor
        ref={editorRef}
        content={normalizedValue}
        extensions={extensions}
        onUpdate={handleUpdate}
        renderControls={showToolbar ? () => <EditorMenuControls /> : undefined}
        immediatelyRender={false}
        RichTextFieldProps={{
          id: fieldId,
          variant: 'outlined',
          sx: {
            mt: 1,
            '& .MuiRichTextContent-root': {
              minHeight,
              px: 1,
            },
          },
        }}
      />
    </FormControl>
  );
};

interface QuestionEditorPanelProps {
  question?: Question;
  questionIndex: number;
  displayNumber?: string;
  childNumberPrefix?: string;
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
  onAddSubquestion: (parentId: string, type?: Question['type']) => void;
  onRemoveSubquestion: (parentId: string, subId: string) => void;
  onRemoveQuestion: (questionId: string) => void;
  onReorderSubquestions?: (parentId: string, fromIdx: number, toIdx: number) => void;
  onDragHandleStart?: (event: React.DragEvent<HTMLElement>) => void;
  onDragHandleEnd?: () => void;
  isDragging?: boolean;
  onInsertSubquestionFromPalette?: (
    parentId: string,
    insertIndex: number,
    type: Question['type']
  ) => void;
  paletteMimeType?: string;
  paletteDragType?: Question['type'] | null;
}

const QuestionEditorPanel: React.FC<QuestionEditorPanelProps> = ({
  question,
  questionIndex,
  displayNumber,
  childNumberPrefix,
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
  onReorderSubquestions,
  onDragHandleStart,
  onDragHandleEnd,
  isDragging,
  onInsertSubquestionFromPalette,
  paletteMimeType,
  paletteDragType,
}) => {
  const [subDragState, setSubDragState] = useState<{
    dragging: string | null;
    parentId: string | null;
    fromIndex: number;
    over: string | null;
    slot: number | null;
  }>({ dragging: null, parentId: null, fromIndex: -1, over: null, slot: null });
  const [paletteDropTarget, setPaletteDropTarget] = useState<{
    parentId: string;
    slot: number;
  } | null>(null);
  const [paletteContainerTargetId, setPaletteContainerTargetId] = useState<
    string | null
  >(null);

  const paletteMime = paletteMimeType ?? 'application/x-eonline-question-type';
  const isComponentPaletteDrag = Boolean(paletteDragType);
  const numberingLabel = displayNumber ?? `${questionIndex + 1}`;
  const childPrefixRoot = childNumberPrefix ?? numberingLabel;

  useEffect(() => {
    if (!isComponentPaletteDrag && paletteDropTarget) {
      setPaletteDropTarget(null);
    }
    if (!isComponentPaletteDrag && paletteContainerTargetId) {
      setPaletteContainerTargetId(null);
    }
  }, [isComponentPaletteDrag, paletteDropTarget, paletteContainerTargetId]);

  const canReceivePaletteDrop = (parent: Question, _parentDepth: number) => {
    if (!isSectionType(parent.type)) return false;
    if (!paletteDragType) return false;
    return IsValidChild(parent.type, paletteDragType);
  };

  const canReceivePaletteDropType = (parent: Question, type: Question['type']) => {
    if (!isSectionType(parent.type)) return false;
    return IsValidChild(parent.type, type);
  };

  const handlePaletteContainerDragOver = (
    event: React.DragEvent,
    parent: Question
  ) => {
    if (!paletteMime || !event.dataTransfer.types.includes(paletteMime)) {
      return;
    }
    const type = event.dataTransfer.getData(paletteMime) as Question['type'];
    if (!type) return;
    if (!canReceivePaletteDropType(parent, type)) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setPaletteContainerTargetId(parent.id);
  };

  const handlePaletteContainerDragLeave = (
    event: React.DragEvent,
    parentId: string
  ) => {
    const next = event.relatedTarget as Node | null;
    if (next && event.currentTarget.contains(next)) {
      return;
    }
    setPaletteContainerTargetId((prev) => (prev === parentId ? null : prev));
  };

  const handlePaletteContainerDrop = (
    event: React.DragEvent,
    parent: Question
  ) => {
    if (!paletteMime || !event.dataTransfer.types.includes(paletteMime)) {
      return;
    }
    const type = event.dataTransfer.getData(paletteMime) as Question['type'];
    if (!type) return;
    if (!canReceivePaletteDropType(parent, type)) return;

    event.preventDefault();
    event.stopPropagation();
    setPaletteContainerTargetId(null);

    const insertIndex = (parent.subquestions ?? []).length;
    onInsertSubquestionFromPalette?.(parent.id, insertIndex, type);
  };

  const handlePaletteSlotDragOver = (
    event: React.DragEvent,
    parent: Question,
    parentDepth: number,
    slotIndex: number
  ) => {
    if (!paletteMime || !event.dataTransfer.types.includes(paletteMime)) {
      return;
    }
    if (!canReceivePaletteDrop(parent, parentDepth)) {
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setPaletteDropTarget((prev) => {
      if (prev && prev.parentId === parent.id && prev.slot === slotIndex) {
        return prev;
      }
      return { parentId: parent.id, slot: slotIndex };
    });
  };

  const handlePaletteSlotDragLeave = (
    event: React.DragEvent,
    parentId: string,
    slotIndex: number
  ) => {
    const next = event.relatedTarget as Node | null;
    if (next && event.currentTarget.contains(next)) {
      return;
    }
    setPaletteDropTarget((prev) => {
      if (!prev) return prev;
      if (prev.parentId === parentId && prev.slot === slotIndex) {
        return null;
      }
      return prev;
    });
  };

  const handlePaletteSlotDrop = (
    event: React.DragEvent,
    parent: Question,
    parentDepth: number,
    slotIndex: number
  ) => {
    if (!paletteMime || !event.dataTransfer.types.includes(paletteMime)) {
      return;
    }
    if (!canReceivePaletteDrop(parent, parentDepth)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation(); // Prevent bubbling to parent containers
    setPaletteDropTarget(null);
    const type = event.dataTransfer.getData(paletteMime) as Question['type'];
    if (!type) return;
    onInsertSubquestionFromPalette?.(parent.id, slotIndex, type);
  };

  const renderPaletteSlot = (
    parent: Question,
    parentDepth: number,
    slotIndex: number
  ): React.ReactNode => {
    if (!onInsertSubquestionFromPalette) {
      return null;
    }
    if (!isComponentPaletteDrag) {
      return null;
    }
    if (!canReceivePaletteDrop(parent, parentDepth)) {
      return null;
    }

    const isActive =
      paletteDropTarget?.parentId === parent.id &&
      paletteDropTarget.slot === slotIndex;

    return (
      <Box
        key={`${parent.id}-palette-slot-${slotIndex}`}
        onDragOver={(event) =>
          handlePaletteSlotDragOver(event, parent, parentDepth, slotIndex)
        }
        onDragLeave={(event) =>
          handlePaletteSlotDragLeave(event, parent.id, slotIndex)
        }
        onDrop={(event) =>
          handlePaletteSlotDrop(event, parent, parentDepth, slotIndex)
        }
        sx={{
          height: isActive ? 40 : 10,
          my: 0.5,
          borderRadius: 1,
          bgcolor: isActive ? 'primary.light' : 'transparent',
          border: '2px dotted',
          borderColor: 'primary.main',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            bgcolor: isActive ? 'primary.light' : 'action.hover',
            height: 20,
          },
        }}
      >
        {isActive && (
          <Typography variant="caption" color="primary.dark">
            Drop here
          </Typography>
        )}
      </Box>
    );
  };
  const handleSubDragStart = (
    event: React.DragEvent,
    parentId: string,
    index: number,
    subId: string
  ) => {
    event.stopPropagation();
    event.dataTransfer.setData(
      SUBQUESTION_DND_MIME,
      JSON.stringify({ parentId, index })
    );
    event.dataTransfer.effectAllowed = 'move';
    setSubDragState({
      dragging: subId,
      parentId,
      fromIndex: index,
      over: null,
      slot: null,
    });
  };

  const handleSubDragOver = (
    event: React.DragEvent,
    subId: string
  ) => {
    if (!subDragState.dragging) return;
    event.preventDefault();
    if (subDragState.over !== subId) {
      setSubDragState((prev) => ({ ...prev, over: subId, slot: null }));
    }
  };

  const handleSubDrop = (
    event: React.DragEvent,
    parentId: string,
    targetIndex: number
  ) => {
    event.preventDefault();
    event.stopPropagation(); // Prevent bubbling
    const payload = event.dataTransfer.getData(SUBQUESTION_DND_MIME);
    setSubDragState({
      dragging: null,
      parentId: null,
      fromIndex: -1,
      over: null,
      slot: null,
    });
    if (!payload) return;
    try {
      const { parentId: sourceParent, index } = JSON.parse(payload) as {
        parentId: string;
        index: number;
      };
      if (sourceParent === parentId) {
        onReorderSubquestions?.(parentId, index, targetIndex);
      }
    } catch {
      /* noop */
    }
  };

  const handleSubDragEnd = () => {
    setSubDragState({
      dragging: null,
      parentId: null,
      fromIndex: -1,
      over: null,
      slot: null,
    });
  };

  const handleSubSlotDragOver = (
    event: React.DragEvent,
    parentId: string,
    slotIndex: number
  ) => {
    if (
      !subDragState.dragging ||
      subDragState.parentId !== parentId ||
      !event.dataTransfer.types.includes(SUBQUESTION_DND_MIME)
    ) {
      return;
    }
    event.preventDefault();
    setSubDragState((prev) => {
      if (prev.slot === slotIndex) {
        return prev;
      }
      return { ...prev, slot: slotIndex, over: null };
    });
  };

  const handleSubSlotDragLeave = (
    event: React.DragEvent,
    parentId: string,
    slotIndex: number
  ) => {
    const next = event.relatedTarget as Node | null;
    if (next && event.currentTarget.contains(next)) {
      return;
    }
    setSubDragState((prev) => {
      if (
        prev.parentId === parentId &&
        prev.slot === slotIndex
      ) {
        return { ...prev, slot: null };
      }
      return prev;
    });
  };

  const handleSubSlotDrop = (
    event: React.DragEvent,
    parentId: string,
    slotIndex: number
  ) => {
    if (
      !subDragState.dragging ||
      subDragState.parentId !== parentId ||
      !event.dataTransfer.types.includes(SUBQUESTION_DND_MIME)
    ) {
      return;
    }
    event.preventDefault();
    event.stopPropagation(); // Prevent bubbling
    const fromIndex = subDragState.fromIndex;
    if (fromIndex === -1) {
      return;
    }
    const targetIndex = fromIndex < slotIndex ? slotIndex - 1 : slotIndex;
    onReorderSubquestions?.(parentId, fromIndex, targetIndex);
    setSubDragState({
      dragging: null,
      parentId: null,
      fromIndex: -1,
      over: null,
      slot: null,
    });
  };

  const renderSubReorderSlot = (
    parentId: string,
    slotIndex: number
  ): React.ReactNode => {
    if (!subDragState.dragging || subDragState.parentId !== parentId) {
      return null;
    }
    const isActive =
      subDragState.slot === slotIndex && subDragState.parentId === parentId;

    return (
      <Box
        key={`${parentId}-reorder-slot-${slotIndex}`}
        onDragOver={(event) =>
          handleSubSlotDragOver(event, parentId, slotIndex)
        }
        onDragLeave={(event) =>
          handleSubSlotDragLeave(event, parentId, slotIndex)
        }
        onDrop={(event) => handleSubSlotDrop(event, parentId, slotIndex)}
        sx={{
          height: isActive ? 40 : 10,
          my: 0.5,
          borderRadius: 1,
          bgcolor: isActive ? 'primary.light' : 'transparent',
          border: isActive ? '2px dashed' : 'none',
          borderColor: 'primary.main',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            bgcolor: isActive ? 'primary.light' : 'action.hover',
            height: 20,
          },
        }}
      >
        {isActive && (
          <Typography
            variant="caption"
            color="primary.dark"
            sx={{ display: 'block', textAlign: 'center', py: 0.5 }}
          >
            Drop to reorder
          </Typography>
        )}
      </Box>
    );
  };


  const renderChoiceOptions = (target: Question) => {
    if (!isChoiceType(target.type) || (target.subquestions?.length ?? 0) > 0) {
      return null;
    }

    const options = target.options ?? [];
    const isRadio = target.type === 'single-select';

    const handleToggle = (option: string, checked: boolean) => {
      if (isRadio) {
        onFieldChange(target.id, 'correctAnswer', option);
        return;
      }

      const current = new Set(target.correctAnswers ?? []);
      if (checked) {
        current.add(option);
      } else {
        current.delete(option);
      }
      onFieldChange(target.id, 'correctAnswers', Array.from(current));
    };

    return (
      <Box sx={{ mt: 1 }}>
        <Typography variant="subtitle2">
          Options &amp; correct answer{isRadio ? '' : 's'}
        </Typography>
        {options.map((option, index) => {
          const trimmed = option.trim();
          const isChecked = isRadio
            ? (target.correctAnswer ?? '') === option
            : Array.isArray(target.correctAnswers) &&
            target.correctAnswers.includes(option);

          return (
            <Stack
              key={index}
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              sx={{ mt: 1 }}
            >
              {isRadio ? (
                <Radio
                  color="primary"
                  checked={isChecked}
                  disabled={!trimmed}
                  onChange={(event) =>
                    handleToggle(option, event.target.checked)
                  }
                />
              ) : (
                <Checkbox
                  color="primary"
                  checked={isChecked}
                  disabled={!trimmed}
                  onChange={(event) =>
                    handleToggle(option, event.target.checked)
                  }
                />
              )}
              <TextField
                label={`Option ${index + 1}`}
                fullWidth
                margin="dense"
                value={option}
                onChange={(e) =>
                  onOptionChange(target.id, index, e.target.value)
                }
              />
            </Stack>
          );
        })}
        <Button onClick={() => onAddOption(target.id)} sx={{ mt: 1 }}>
          Add Option
        </Button>
      </Box>
    );
  };

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

  if (question.type === 'placeholder') {
    const handleDrop = (event: React.DragEvent) => {
      const type = event.dataTransfer.getData(NEW_QUESTION_DND_MIME) as Question['type'];
      if (type) {
        event.preventDefault();
        onTypeChange(question.id, type);
      }
    };

    const handleDragOver = (event: React.DragEvent) => {
      if (event.dataTransfer.types.includes(NEW_QUESTION_DND_MIME)) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
      }
    };

    return (
      <Paper
        sx={{
          p: 4,
          mb: 2,
          border: '2px dashed',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <DragIndicatorIcon sx={{ fontSize: 40, opacity: 0.3, mb: 1 }} />
        <Typography variant="subtitle1" color="text.secondary">
          Drop Question Type Here
        </Typography>
        <Button onClick={() => onRemoveQuestion(question.id)} sx={{ mt: 2 }}>
          Cancel
        </Button>
      </Paper>
    );
  }

  const renderContainerDropHint = (
    parent: Question,
    mode: 'empty' | 'append' = 'empty'
  ) => {
    const hint = allowedTypeHint(parent.type);
    if (!hint) return null;

    const isActive = paletteContainerTargetId === parent.id;
    const label =
      mode === 'append'
        ? `Drag ${hint} here to add another item`
        : `Drag ${hint} here`;

    return (
      <Box
        onDragOver={(event) => handlePaletteContainerDragOver(event, parent)}
        onDragLeave={(event) => handlePaletteContainerDragLeave(event, parent.id)}
        onDrop={(event) => handlePaletteContainerDrop(event, parent)}
        sx={{
          mt: 1,
          mb: 1,
          p: 1.5,
          minHeight: 56,
          display: 'flex',
          alignItems: 'center',
          borderRadius: 1,
          border: '2px dotted',
          borderColor: isActive ? 'primary.main' : 'divider',
          bgcolor: isActive ? 'primary.light' : 'transparent',
          transition: 'all 0.15s ease',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover',
          },
        }}
      >
        <Typography
          variant="body2"
          color={isActive ? 'primary.dark' : 'text.secondary'}
        >
          {label}
        </Typography>
      </Box>
    );
  };

  const renderSubquestion = (
    sub: Question,
    numbering: string,
    depth: number,
    parentId: string,
    subIndex: number
  ): React.ReactNode => {
    const isLeaf = !sub.subquestions || sub.subquestions.length === 0;
    const isDragTarget = subDragState.over === sub.id;
    const isDragging = subDragState.dragging === sub.id;
    const isVideoSub = sub.type === 'video';
    const isPdfSub = sub.type === 'pdf';

    return (
      <Paper
        key={sub.id}
        draggable
        onDragStart={(event) =>
          handleSubDragStart(event, parentId, subIndex, sub.id)
        }
        onDragOver={(event) => handleSubDragOver(event, sub.id)}
        onDrop={(event) =>
          handleSubDrop(event, parentId, subIndex)
        }
        onDragEnd={handleSubDragEnd}
        sx={{
          mb: 1,
          mt: 1,
          p: 1.5,
          border: '1px dashed',
          borderColor: isDragTarget ? 'primary.main' : 'divider',
          opacity: isDragging ? 0.6 : 1,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <DragIndicatorIcon fontSize="small" color="disabled" />
          <Typography variant="subtitle2">Question {numbering}</Typography>
        </Stack>
        
        {isVideoSub || isPdfSub ? (
          <TextField
            label="Section Title"
            fullWidth
            margin="normal"
            value={sub.questionText ?? ''}
            onChange={(e) => onFieldChange(sub.id, 'questionText', e.target.value)}
          />
        ) : (
          <QuestionRichTextField
            label={depth === 1 ? 'Subquestion Text' : 'Nested Question Text'}
            value={sub.questionText ?? ''}
            placeholder={
              depth === 1
                ? 'Enter the supporting question prompt...'
                : 'Enter the nested question prompt...'
            }
            minHeight={depth > 1 ? 150 : 180}
            showToolbar={depth <= 1}
            onChange={(value) => onFieldChange(sub.id, 'questionText', value)}
          />
        )}

        {isVideoSub && (
          <VideoUploadField
            value={sub.video}
            onChange={(video) => onFieldChange(sub.id, 'video', video)}
          />
        )}
        {isPdfSub && (
          <PdfUploadField
            value={sub.pdf}
            onChange={(pdf) => onFieldChange(sub.id, 'pdf', pdf)}
          />
        )}

        <Stack spacing={1} direction="row">
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
                .filter(
                  (type) => {
                    // If parent is Group, allow Video/PDF/Choice
                    // If parent is Video/PDF, allow Choice only
                    if (question.type === 'group') return true;
                    return type.value !== 'video' && type.value !== 'pdf';
                  }
                )
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

        {isLeaf && isChoiceType(sub.type) && renderChoiceOptions(sub)}

        {isSectionType(sub.type) && (
          <Box sx={{ borderLeft: '2px solid', borderColor: 'divider', pl: 2, mt: 1 }}>
            {(sub.subquestions ?? []).length === 0 && renderContainerDropHint(sub, 'empty')}
            {renderSubquestionList(sub, depth, numbering)}
            {(sub.subquestions ?? []).length > 0 && renderContainerDropHint(sub, 'append')}
          </Box>
        )}

        <Stack direction="row" spacing={1} mt={2} alignItems="center">
          <Box flexGrow={1} />
          <IconButton onClick={() => onRemoveSubquestion(parentId, sub.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Paper>
    );
  };

  const renderSubquestionList = (
    parent: Question,
    parentDepth: number,
    numberingPrefix: string
  ): React.ReactNode => {
    const subs = parent.subquestions ?? [];
    const elements: React.ReactNode[] = [];
    const showingReorderSlots =
      Boolean(subDragState.dragging) && subDragState.parentId === parent.id;
    const resolvedPrefix = numberingPrefix || numberingLabel;

    subs.forEach((subquestion, idx) => {
      const slot = showingReorderSlots
        ? renderSubReorderSlot(parent.id, idx)
        : renderPaletteSlot(parent, parentDepth, idx);
      if (slot) {
        elements.push(slot);
      }
      elements.push(
        renderSubquestion(
          subquestion,
          `${resolvedPrefix}.${idx + 1}`,
          parentDepth + 1,
          parent.id,
          idx
        )
      );
    });

    const tailSlot = showingReorderSlots
      ? renderSubReorderSlot(parent.id, subs.length)
      : renderPaletteSlot(parent, parentDepth, subs.length);
    if (tailSlot) {
      elements.push(tailSlot);
    }

    return elements.length > 0 ? elements : null;
  };

  const isSection =
    question.type === 'video' || question.type === 'pdf' || question.type === 'group';
  const isVideo = question.type === 'video';
  const isPdf = question.type === 'pdf';
  const isGroup = question.type === 'group';
  const hasSubquestions =
    question.subquestions && question.subquestions.length > 0;
  const showTypeControls = (!isSection || !hasSubquestions) && !isGroup;

  return (
    <Paper
      draggable={Boolean(onDragHandleStart)}
      onDragStart={(event: React.DragEvent<HTMLElement>) =>
        onDragHandleStart?.(event)
      }
      onDragEnd={() => onDragHandleEnd?.()} key={question.id} sx={{ p: 2, mb: 0 }}>
      <Stack direction="row" spacing={1} sx={{
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isDragging ? 'grabbing' : 'grab',
        color: isDragging ? 'text.primary' : 'text.disabled',
        mr: 0.5,
        '&:active': { cursor: 'grabbing' },
      }}>
        <DragIndicatorIcon fontSize="small" />
        <Typography variant="subtitle1" fontWeight={600}>
          {`${isSection ? (isGroup ? 'Question' : 'Section') : 'Question'} ${numberingLabel}`}
        </Typography>
        {isSection && hasSubquestions && (
          <Typography variant="caption" color="text.secondary">
            Total Weight: {computeTotalWeight(question)}
          </Typography>
        )}
        <Box flexGrow={1} />
      </Stack>
      {isSection ? (
        <>
          {isGroup ? (
            <QuestionRichTextField
              label="Question Text"
              value={question.questionText ?? ''}
              placeholder="Enter the question prompt..."
              onChange={(value) =>
                onFieldChange(question.id, 'questionText', value)
              }
            />
          ) : (
            <TextField
              label="Section Title"
              fullWidth
              margin="normal"
              value={question.questionText}
              onChange={(e) =>
                onFieldChange(question.id, 'questionText', e.target.value)
              }
            />
          )}
          {isVideo && (
            <VideoUploadField
              value={question.video}
              onChange={(video) => onFieldChange(question.id, 'video', video)}
            />
          )}
          {isPdf && (
            <PdfUploadField
              value={question.pdf}
              onChange={(pdf) => onFieldChange(question.id, 'pdf', pdf)}
            />
          )}
        </>
      ) : (
        <QuestionRichTextField
          label="Question Text"
          value={question.questionText ?? ''}
          placeholder="Enter the question prompt..."
          onChange={(value) =>
            onFieldChange(question.id, 'questionText', value)
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
            {!isSection && (
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

          {isChoiceType(question.type) &&
            !hasSubquestions &&
            renderChoiceOptions(question)}
        </>
      )}

      <Stack direction="row" spacing={1} mt={2} alignItems="center">
        {isSection && (
          <Button
            variant="outlined"
            onClick={() => onAddSubquestion(question.id)}
          >
            Add Question to Section
          </Button>
        )}
        <Box flexGrow={1} />
        <IconButton onClick={() => onRemoveQuestion(question.id)}>
          <DeleteIcon />
        </IconButton>
      </Stack>

      {isSection && (
        <Box sx={{ ml: 0.5, borderLeft: '2px solid', borderColor: 'divider', pl: 1, mt: 2 }}>
          {(question.subquestions ?? []).length === 0 &&
            renderContainerDropHint(question, 'empty')}
          {renderSubquestionList(question, 0, childPrefixRoot)}
          {(question.subquestions ?? []).length > 0 &&
            renderContainerDropHint(question, 'append')}
          {!isGroup && (
            <Button
              sx={{ mt: 1 }}
              size="small"
              onClick={() => onAddSubquestion(question.id)}
            >
              Add Another Question to {isGroup ? 'Question' : 'Section'}
            </Button>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default QuestionEditorPanel;
