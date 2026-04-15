'use client';

import React from 'react';
import { Box, Chip, Checkbox, Radio, RadioGroup, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { Question } from '@/app/_lib/interfaces/types';
import { VideoPlayer } from '@/app/_lib/components/video/VideoPlayer';
import PDFViewer from '@/app/_lib/components/PDFViewer/PDFViewer';
import QuestionTextDisplay from '@/app/_lib/components/TipTapEditor/QuestionTextDisplay';
import type { QuestionPreviewPanelProps } from './interfaces';
import {
    EmptyPreviewPaper,
    IntroPaper,
    NodePaper,
    HeaderMeta,
    PromptRow,
    PromptColumn,
    ToneChip,
    QuestionNumber,
    PdfContainer,
    PdfFrame,
    OptionLabel,
    CenterFallback,
    OptionsColumn,
} from './elements';
import { getPreviewTone, getToneStyle } from './utils';

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
        depth: number = 1,
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
                    $tone={tone}
                    $indentLevel={indent}
                >
                    <HeaderMeta
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1}
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                    >
                        <Chip size="small" label="Student Preview" color="success" variant="filled" />
                        <ToneChip size="small" label={toneStyle.label} $tone={tone} variant="outlined" />
                    </HeaderMeta>
                    <PromptRow>
                        <QuestionNumber variant={textVariant} $tone={tone}>
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
                        renderQuestion(sub, `${numbering}.${idx + 1}`, depth + 1),
                    )}
                </NodePaper>
            );
        }

        const options = node.options ?? [];

        return (
            <NodePaper
                key={node.id}
                variant="outlined"
                $tone={tone}
                $indentLevel={indent}
            >
                <HeaderMeta
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                >
                    <Chip size="small" label="Student Preview" color="success" variant="filled" />
                    <ToneChip size="small" label={toneStyle.label} $tone={tone} variant="outlined" />
                </HeaderMeta>
                <PromptColumn>
                    <PromptRow>
                        <QuestionNumber variant={textVariant} $tone={tone}>
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
                                                $selected={(node.correctAnswer ?? '') === option}
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
                                            $selected={
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
