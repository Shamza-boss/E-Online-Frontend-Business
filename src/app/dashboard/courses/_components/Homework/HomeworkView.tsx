'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Paper,
  Box,
  Stack,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import PaginationItem from '@mui/material/PaginationItem';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import {
  Homework,
  SubmittedHomework,
  Question,
} from '../../../../_lib/interfaces/types';
import { format } from 'date-fns';
import QuestionTreeRenderer from '@/app/_lib/components/question/QuestionTreeRenderer';
import PDFViewer from '@/app/_lib/components/PDFViewer/PDFViewer';

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
}

const HomeworkView: React.FC<HomeworkViewProps> = ({
  homework,
  onSubmit,
  readOnly = false,
}) => {
  const [answers, setAnswers] = useState<{ [questionId: string]: any }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [pdfPreview, setPdfPreview] = useState<{
    title: string;
    url: string;
    key?: string | null;
  } | null>(null);

  const questionCount = homework.questions.length;
  const currentQuestion = homework.questions[currentQuestionIndex];

  const handleChange = (questionId: string, value: any) => {
    if (!readOnly) {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!readOnly) {
      const submitted: SubmittedHomework = { homework, answers };
      onSubmit(submitted);
    }
  };

  const computeTotalWeight = (node: Question): number => {
    if (node.subquestions && node.subquestions.length > 0) {
      return node.subquestions.reduce(
        (sum, sub) => sum + computeTotalWeight(sub),
        0
      );
    }

    return Number.isFinite(node.weight) ? node.weight : 0;
  };

  const openPdfPreview = (fallbackTitle: string, pdf?: Question['pdf']) => {
    if (!pdf?.url) return;
    setPdfPreview({
      title: pdf.title || fallbackTitle || 'PDF Document',
      url: pdf.url,
      key: pdf.key,
    });
  };

  const closePdfPreview = () => setPdfPreview(null);

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

  return (
    <React.Fragment>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ flex: '1 1 auto' }} variant="h6">
            Due on{' '}
            {format(new Date(Date.parse(homework.dueDate)), 'MM/ dd / yyyy')}
          </Typography>
          {!readOnly && (
            <Button autoFocus color="inherit" onClick={handleSubmit}>
              Submit Answers
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Paper sx={{ p: 2, m: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          {homework.description}
        </Typography>
        <form onSubmit={handleSubmit}>
          {questionCount > 0 ? (
            <>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 2 }}
              >
                <Typography variant="subtitle1">
                  Viewing Question {currentQuestionIndex + 1} of {questionCount}
                </Typography>
                <Pagination
                  count={questionCount}
                  page={currentQuestionIndex + 1}
                  onChange={(_, page) => setCurrentQuestionIndex(page - 1)}
                  renderItem={(item) => (
                    <PaginationItem {...item} page={`Question ${item.page}`} />
                  )}
                />
              </Stack>
              {currentQuestion && (
                <QuestionTreeRenderer
                  mode="student"
                  question={currentQuestion}
                  questionIndex={currentQuestionIndex}
                  computeTotalWeight={computeTotalWeight}
                  answers={answers}
                  onAnswerChange={handleChange}
                  readOnly={readOnly}
                  renderPdfAttachment={renderPdfAttachment}
                />
              )}
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No questions to display.
            </Typography>
          )}
        </form>
      </Paper>
      <Dialog
        open={Boolean(pdfPreview)}
        onClose={closePdfPreview}
        fullWidth
        maxWidth="lg"
        PaperProps={{ sx: { height: { xs: '90vh', md: '80vh' } } }}
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
          sx={{
            p: 0,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
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

export default HomeworkView;
