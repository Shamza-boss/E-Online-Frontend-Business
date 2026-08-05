'use client';

import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Splitter from '@devbookhq/splitter';
import PaginatedQuestionLayout from '@/app/_lib/components/homework/PaginatedQuestionLayout';
import { GutterStyles } from '@/app/_lib/components/shared-theme/customizations/SplitterComponent';
import type { Question } from '@/app/_lib/interfaces/types';
import { NEW_QUESTION_DND_MIME } from '../../../FormBuilder/questionUtils';
import {
  BuilderContentBox,
  EmptyEditorArea,
  PaletteDragItem,
  PreviewPaper,
  SidebarContainer,
} from '../elements';
import { QUESTION_TYPES } from '../constants';

export type FormBuilderBuilderStepProps = {
  questions: Question[];
  currentQuestionIndex: number;
  splitSizes: number[] | undefined;
  paletteDragType: Question['type'] | null;
  questionEditor: (question: Question, index: number) => React.ReactNode;
  questionPreview: (question: Question, index: number) => React.ReactNode;
  emptyEditor: React.ReactNode;
  emptyPreview: React.ReactNode;
  renderEditorSummary: (index: number, total: number) => React.ReactNode;
  renderStudentSummary: (index: number, total: number) => React.ReactNode;
  onIndexChange: (index: number) => void;
  onPrevious: () => void;
  onAddQuestion: () => void;
  onPaletteDragStart: (type: Question['type']) => void;
  onPaletteDragEnd: () => void;
  onContainerDragOver: (event: React.DragEvent) => void;
  onContainerDrop: (event: React.DragEvent) => void;
  onSplitResizeFinished: (gutterIdx: number, sizes: number[]) => void;
}

export default function FormBuilderBuilderStep({
  questions,
  currentQuestionIndex,
  splitSizes,
  paletteDragType,
  questionEditor,
  questionPreview,
  emptyEditor,
  emptyPreview,
  renderEditorSummary,
  renderStudentSummary,
  onIndexChange,
  onPrevious,
  onAddQuestion,
  onPaletteDragStart,
  onPaletteDragEnd,
  onContainerDragOver,
  onContainerDrop,
  onSplitResizeFinished,
}: FormBuilderBuilderStepProps) {
  return (
    <BuilderContentBox>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        spacing={2}
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Build questions &amp; preview responses
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Drag the divider to resize the editor and the live student preview.
          </Typography>
        </Box>
        <Button variant="outlined" color="warning" onClick={onPrevious}>
          Back to details
        </Button>
      </Stack>
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', gap: 2 }}>
        <SidebarContainer>
          <Typography variant="subtitle2" color="text.secondary">
            Drag to add
          </Typography>
          {QUESTION_TYPES.map((type) => (
            <Box
              key={type.value}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData(NEW_QUESTION_DND_MIME, type.value);
                e.dataTransfer.effectAllowed = 'copy';
                onPaletteDragStart(type.value as Question['type']);
              }}
              onDragEnd={onPaletteDragEnd}
            >
              <PaletteDragItem variant="outlined">
                <DragIndicatorIcon color="action" />
                <Typography variant="body2">{type.label}</Typography>
              </PaletteDragItem>
            </Box>
          ))}
          <Button variant="contained" color="success" onClick={onAddQuestion} sx={{ mt: 2 }}>
            Add Question
          </Button>
        </SidebarContainer>
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <GutterStyles />
          <Splitter
            gutterClassName="custom-gutter-horizontal"
            draggerClassName="custom-dragger-horizontal"
            initialSizes={splitSizes ?? [55, 45]}
            onResizeFinished={onSplitResizeFinished}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                pr: { xs: 0, md: 2 },
              }}
              onDragOver={onContainerDragOver}
              onDrop={onContainerDrop}
            >
              <Box sx={{ flex: 1, overflow: 'auto' }}>
                <PaginatedQuestionLayout
                  questions={questions}
                  currentIndex={currentQuestionIndex}
                  onIndexChange={onIndexChange}
                  renderQuestion={(question, _numbering, index) =>
                    questionEditor(question, index)
                  }
                  emptyState={emptyEditor}
                  paginationLabel="Question"
                  summaryLabel={renderEditorSummary}
                  topSpacing={0}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'auto',
                pl: { xs: 0, md: 2 },
              }}
            >
              <PreviewPaper>
                <PaginatedQuestionLayout
                  questions={questions}
                  currentIndex={currentQuestionIndex}
                  onIndexChange={onIndexChange}
                  renderQuestion={(question, _numbering, index) =>
                    questionPreview(question, index)
                  }
                  emptyState={emptyPreview}
                  paginationLabel="Question"
                  summaryLabel={renderStudentSummary}
                  topSpacing={0}
                />
              </PreviewPaper>
            </Box>
          </Splitter>
        </Box>
      </Box>
    </BuilderContentBox>
  );
}

export function FormBuilderEmptyEditor({
  onDragOver,
  onDrop,
}: {
  onDragOver: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent) => void;
}) {
  return (
    <EmptyEditorArea onDragOver={onDragOver} onDrop={onDrop}>
      <Box>
        <DragIndicatorIcon sx={{ fontSize: 48, opacity: 0.5, mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Drag a question type here
        </Typography>
        <Typography variant="body2">
          Select a question type from the sidebar and drag it here to start building your module.
        </Typography>
      </Box>
    </EmptyEditorArea>
  );
}
