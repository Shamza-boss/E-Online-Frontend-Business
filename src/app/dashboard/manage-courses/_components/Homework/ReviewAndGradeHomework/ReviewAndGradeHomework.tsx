'use client';

import React, { useState, useCallback } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    Checkbox,
    Box,
    Divider,
    Stack,
    Pagination,
} from '@mui/material';
import PaginationItem from '@mui/material/PaginationItem';
import { VideoPlayer } from '@/app/_lib/components/video/VideoPlayer';
import type { Question, GradedHomework } from '@/app/_lib/interfaces/types';
import dynamic from 'next/dynamic';
import { MathJaxContext } from 'better-react-mathjax';
import PDFViewer from '@/app/_lib/components/PDFViewer';
import type { ReviewAndGradeHomeworkProps, GradingData, GradingEntry } from './types';
import {
    ContentPaper,
    PdfPreviewBox,
    PdfFallbackBox,
    QuestionBlock,
    AnswerSection,
    GradingBox,
} from './elements';
import { MATHJAX_CONFIG } from './constants';
import { getGradeBorder, computeGradingUpdate, computeOverallTotals } from './utils';

const MathJax = dynamic(
    () => import('better-react-mathjax').then((mod) => mod.MathJax),
    { ssr: false },
);

const ReviewAndGradeHomework: React.FC<ReviewAndGradeHomeworkProps> = ({
    submittedHomework,
    onSubmitGrading,
}) => {
    const { homework, answers } = submittedHomework;

    const [gradingData, setGradingData] = useState<GradingData>({});
    const [overallComment, setOverallComment] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const questionCount = homework.questions.length;
    const currentQuestion = homework.questions[currentQuestionIndex];

    const updateGrading = useCallback(
        (questionId: string, newData: Partial<GradingEntry>) => {
            setGradingData((prev) =>
                computeGradingUpdate(prev, questionId, newData, homework.questions),
            );
        },
        [homework.questions],
    );

    const renderQuestion = (
        question: Question,
        numbering: string,
        depth: number = 1,
    ) => {
        const indent = depth > 1 ? (depth - 1) * 2 : 0;
        const textVariant = depth === 1 ? 'h6' : 'body2';

        if (question.subquestions?.length) {
            const totalWeight = question.subquestions.reduce(
                (sum, sub) => sum + sub.weight,
                0,
            );
            return (
                <QuestionBlock key={question.id} $indent={indent}>
                    <Typography variant={textVariant}>
                        {numbering}. {question.questionText} (Total Weight: {totalWeight})
                    </Typography>
                    {question.type === 'video' && question.video && (
                        <Box sx={{ mt: 2 }}>
                            <VideoPlayer
                                video={question.video}
                                title={question.questionText}
                            />
                        </Box>
                    )}
                    {question.type === 'pdf' && (
                        <PdfPreviewBox>
                            {question.pdf?.url ? (
                                <PDFViewer
                                    key={question.pdf.key || question.id}
                                    fileUrl={question.pdf.url}
                                    initialPage={1}
                                />
                            ) : (
                                <PdfFallbackBox>
                                    <Typography variant="body2" color="text.secondary">
                                        Document unavailable
                                    </Typography>
                                </PdfFallbackBox>
                            )}
                        </PdfPreviewBox>
                    )}
                    {question.subquestions.map((sub, idx) =>
                        renderQuestion(sub, `${numbering}.${idx + 1}`, depth + 1),
                    )}
                </QuestionBlock>
            );
        }

        return (
            <MathJaxContext version={3} config={MATHJAX_CONFIG}>
                <QuestionBlock key={question.id} $indent={indent}>
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Typography variant={textVariant}>
                            {numbering}. {question.questionText}
                        </Typography>
                        {question.type === 'video' && question.video && (
                            <Box sx={{ ml: 2 }}>
                                <VideoPlayer
                                    video={question.video}
                                    title={question.questionText}
                                />
                            </Box>
                        )}
                        {question.type === 'pdf' && (
                            <Box sx={{ ml: 2 }}>
                                {question.pdf?.url ? (
                                    <PdfPreviewBox>
                                        <PDFViewer
                                            key={question.pdf.key || question.id}
                                            fileUrl={question.pdf.url}
                                            initialPage={1}
                                        />
                                    </PdfPreviewBox>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        Document unavailable
                                    </Typography>
                                )}
                            </Box>
                        )}
                        <Typography variant="caption" color="text.secondary">
                            (Weight: {question.weight})
                        </Typography>
                    </Box>

                    <AnswerSection>
                        {(() => {
                            const answer = answers[question.id];
                            switch (question.type) {
                                case 'video':
                                case 'pdf':
                                    return null;
                                case 'single-select':
                                    return (
                                        <RadioGroup value={answer || ''} row>
                                            {question.options?.map((option, idx) => (
                                                <FormControlLabel
                                                    key={idx}
                                                    value={option}
                                                    control={<Radio disabled />}
                                                    label={option}
                                                />
                                            ))}
                                        </RadioGroup>
                                    );
                                case 'multi-select':
                                    return (
                                        <Box>
                                            {question.options?.map((option, idx) => (
                                                <FormControlLabel
                                                    key={idx}
                                                    control={
                                                        <Checkbox
                                                            disabled
                                                            checked={
                                                                Array.isArray(answer)
                                                                    ? answer.includes(option)
                                                                    : false
                                                            }
                                                        />
                                                    }
                                                    label={option}
                                                />
                                            ))}
                                        </Box>
                                    );
                                default:
                                    return null;
                            }
                        })()}
                    </AnswerSection>

                    <GradingBox
                        $borderColor={getGradeBorder(
                            gradingData[question.id]?.grade || 0,
                            question.weight,
                        )}
                    >
                        <TextField
                            label={`Grade for ${numbering}`}
                            type="number"
                            fullWidth
                            inputProps={{ min: 0, max: question.weight }}
                            value={gradingData[question.id]?.grade || ''}
                            onChange={(e) =>
                                updateGrading(question.id, {
                                    grade: Number(e.target.value),
                                })
                            }
                            sx={{ mb: 1 }}
                        />
                        <TextField
                            label={`Comment for ${numbering}`}
                            multiline
                            fullWidth
                            value={gradingData[question.id]?.comment || ''}
                            onChange={(e) =>
                                updateGrading(question.id, {
                                    comment: e.target.value,
                                })
                            }
                        />
                    </GradingBox>
                </QuestionBlock>
            </MathJaxContext>
        );
    };

    const { totalEstimated, totalAwarded } = computeOverallTotals(
        homework.questions,
        gradingData,
    );
    const overallPercentage =
        totalEstimated > 0 ? Math.round((totalAwarded / totalEstimated) * 100) : 0;

    const handleSubmitGrading = useCallback(() => {
        const gradedHomework: GradedHomework = {
            homework,
            answers,
            grading: gradingData,
            overallComment,
        };
        onSubmitGrading(gradedHomework);
    }, [answers, gradingData, homework, onSubmitGrading, overallComment]);

    return (
        <MathJaxContext version={3} config={MATHJAX_CONFIG}>
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <Typography sx={{ flex: 1 }} variant="h6">
                        {homework.title}
                    </Typography>
                    <Typography variant="h6" sx={{ mr: 2 }}>
                        {totalAwarded} / {totalEstimated} ({overallPercentage}%)
                    </Typography>
                    <Button color="inherit" onClick={handleSubmitGrading}>
                        Submit Grading
                    </Button>
                </Toolbar>
            </AppBar>
            <ContentPaper>
                <Typography variant="subtitle1" gutterBottom>
                    {homework.description}
                </Typography>
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
                        {currentQuestion &&
                            renderQuestion(
                                currentQuestion,
                                (currentQuestionIndex + 1).toString(),
                            )}
                    </>
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        No questions to review.
                    </Typography>
                )}
                <Divider sx={{ my: 2 }} />
                <TextField
                    label="Overall Comment for Assessment"
                    fullWidth
                    multiline
                    value={overallComment}
                    onChange={(e) => setOverallComment(e.target.value)}
                />
            </ContentPaper>
        </MathJaxContext>
    );
};

export default ReviewAndGradeHomework;
