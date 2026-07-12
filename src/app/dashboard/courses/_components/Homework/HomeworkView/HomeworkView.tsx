'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Typography, Button } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import type { Question } from '../../../../../_lib/interfaces/types';
import { sortQuestionTreeByDisplayOrder } from '@/app/_lib/utils/questionOrder';
import type { HomeworkViewProps, HomeworkNavState, PdfPreviewState, HomeworkAnswersMap, HomeworkAnswerValue } from './types';
import { COVER_PAGE } from './constants';
import {
  computeTotalWeight,
  buildPdfPreview,
  isNodeCompleted,
  updateAnswer,
  toggleMultiSelectOption,
  hasAssessmentStarted,
  computeCompletionStats,
} from './utils';
import { PageSurface, ViewShell, QuestionScrollBox } from './elements';
import CoverPage from './components/CoverPage';
import QuestionNode from './components/QuestionNode';
import PdfPreviewDialog from './components/PdfPreviewDialog';
import HomeworkFooter from './components/HomeworkFooter';
import HomeworkDialogs from './components/HomeworkDialogs';

const HomeworkView: React.FC<HomeworkViewProps> = ({
  homework,
  onSubmit,
  readOnly = false,
  onBack,
  onNavChange,
}) => {
  const [answers, setAnswers] = useState<HomeworkAnswersMap>({});
  const [currentPage, setCurrentPage] = useState(COVER_PAGE);
  const [pdfPreview, setPdfPreview] = useState<PdfPreviewState | null>(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showBackWarning, setShowBackWarning] = useState(false);

  const sortedQuestions = useMemo(
    () => sortQuestionTreeByDisplayOrder(homework.questions),
    [homework.questions],
  );

  const totalQuestions = sortedQuestions.length;
  const isCoverPage = currentPage === COVER_PAGE;
  const questionIndex = isCoverPage ? 0 : currentPage;
  const safeIndex =
    totalQuestions > 0
      ? Math.min(Math.max(questionIndex, 0), totalQuestions - 1)
      : 0;

  const handleChange = (questionId: string, value: HomeworkAnswerValue) => {
    if (!readOnly) {
      setAnswers((prev) => updateAnswer(prev, questionId, value));
    }
  };

  const handleMultiSelectToggle = (
    questionId: string,
    option: string,
    checked: boolean,
  ) => {
    if (readOnly) return;
    setAnswers((prev) => toggleMultiSelectOption(prev, questionId, option, checked));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!readOnly) {
      setShowSubmitConfirm(true);
    }
  };

  const confirmSubmit = () => {
    setShowSubmitConfirm(false);
    onSubmit({ homework, answers });
  };

  const handleBackClick = () => {
    if (hasAssessmentStarted(answers, currentPage)) {
      setShowBackWarning(true);
    } else {
      onBack?.();
    }
  };

  const confirmBack = () => {
    setShowBackWarning(false);
    onBack?.();
  };

  const totalWeight = useMemo(
    () => sortedQuestions.reduce((s, q) => s + computeTotalWeight(q), 0),
    [sortedQuestions],
  );

  const openPdfPreview = (fallbackTitle: string, pdf?: Question['pdf']) => {
    const preview = buildPdfPreview(fallbackTitle, pdf);
    if (preview) setPdfPreview(preview);
  };

  const { answeredCount, completionPercent } = useMemo(
    () => computeCompletionStats(sortedQuestions, answers),
    [sortedQuestions, answers],
  );

  const navState: HomeworkNavState = {
    currentIndex: safeIndex,
    totalQuestions,
    canGoPrev: currentPage > COVER_PAGE,
    canGoNext: !isCoverPage && safeIndex < totalQuestions - 1,
    onPrev: () => setCurrentPage((p) => Math.max(COVER_PAGE, p - 1)),
    onNext: () => setCurrentPage((p) => Math.min(totalQuestions - 1, p + 1)),
    onGoTo: setCurrentPage,
    isCompleted: (i) => {
      const question = sortedQuestions[i];
      return question ? isNodeCompleted(question, answers) : false;
    },
    readOnly,
    onSubmit: () => handleSubmit(),
  };

  useEffect(() => {
    onNavChange?.(navState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeIndex, totalQuestions, readOnly, answers, currentPage]);

  const currentQuestion = sortedQuestions[safeIndex];

  return (
    <React.Fragment>
      <ViewShell>
        <PageSurface>
          {onBack && (
            <Button
              size="small"
              onClick={handleBackClick}
              startIcon={<ArrowBackRoundedIcon fontSize="small" />}
              variant="contained"
              color="warning"
              sx={{ alignSelf: 'flex-start', fontWeight: 700, px: 4, mb: 2 }}
            >
              Back to assessments
            </Button>
          )}
          {isCoverPage ? (
            <CoverPage
              homework={homework}
              sortedQuestions={sortedQuestions}
              totalQuestions={totalQuestions}
              totalWeight={totalWeight}
              readOnly={readOnly}
              onStart={() => setCurrentPage(0)}
            />
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
              {totalQuestions > 0 && currentQuestion ? (
                <QuestionScrollBox>
                  <QuestionNode
                    node={currentQuestion}
                    numbering={String(safeIndex + 1)}
                    answers={answers}
                    readOnly={readOnly}
                    onChange={handleChange}
                    onMultiSelectToggle={handleMultiSelectToggle}
                    onOpenPdf={openPdfPreview}
                  />
                </QuestionScrollBox>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No questions to display.
                </Typography>
              )}
            </form>
          )}
        </PageSurface>

        {!isCoverPage && totalQuestions > 0 && (
          <HomeworkFooter
            sortedQuestions={sortedQuestions}
            answers={answers}
            currentPage={currentPage}
            safeIndex={safeIndex}
            totalQuestions={totalQuestions}
            answeredCount={answeredCount}
            completionPercent={completionPercent}
            readOnly={readOnly}
            onPageChange={setCurrentPage}
            onSubmit={handleSubmit}
          />
        )}
      </ViewShell>

      <PdfPreviewDialog preview={pdfPreview} onClose={() => setPdfPreview(null)} />

      <HomeworkDialogs
        showSubmitConfirm={showSubmitConfirm}
        showBackWarning={showBackWarning}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
        onConfirmSubmit={confirmSubmit}
        onCancelSubmit={() => setShowSubmitConfirm(false)}
        onConfirmBack={confirmBack}
        onCancelBack={() => setShowBackWarning(false)}
      />
    </React.Fragment>
  );
};

export default HomeworkView;
