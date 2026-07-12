'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
    Box,
    Button,
    Chip,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import type { Question } from '@/app/_lib/interfaces/types';
import { VideoUploadField } from '@/app/_lib/components/video/VideoUploadField';
import { PdfUploadField } from '@/app/_lib/components/pdf/PdfUploadField';
import { isChoiceType, IsValidChild, NEW_QUESTION_DND_MIME } from '../questionUtils';
import ConfirmDialog from '@/app/_lib/components/dialog/ConfirmDialog';
import type { QuestionEditorPanelProps } from './types';
import { SUBQUESTION_DND_MIME } from './constants';
import {
    isSectionType,
    allowedTypeHint,
    getTypeVisual,
    cleanupDragPreview,
    setSolidDragPreview,
} from './utils';
import {
    EmptyStatePaper,
    PlaceholderPaper,
    QuestionPaper,
    SubquestionPaper,
    HeaderBar,
    SubHeaderBar,
    PaletteSlotBox,
    ReorderSlotBox,
    DropHintBox,
    ContainerBranch,
} from './elements';
import QuestionRichTextField from './components/QuestionRichTextField';
import QuestionTypeSelector from './components/QuestionTypeSelector';
import QuestionOptionsEditor from './components/QuestionOptionsEditor';

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
    const dragPreviewRef = useRef<HTMLElement | null>(null);
    const [pendingDelete, setPendingDelete] = useState<
        | { kind: 'question'; questionId: string }
        | { kind: 'subquestion'; parentId: string; subId: string }
        | null
    >(null);

    const paletteMime = paletteMimeType ?? 'application/x-eonline-question-type';
    const isComponentPaletteDrag = Boolean(paletteDragType);
    const numberingLabel = displayNumber ?? `${questionIndex + 1}`;
    const childPrefixRoot = childNumberPrefix ?? numberingLabel;

    const requestQuestionDelete = (questionId: string) => {
        setPendingDelete({ kind: 'question', questionId });
    };

    const requestSubquestionDelete = (parentId: string, subId: string) => {
        setPendingDelete({ kind: 'subquestion', parentId, subId });
    };

    const handleConfirmDelete = () => {
        if (!pendingDelete) return;

        if (pendingDelete.kind === 'question') {
            onRemoveQuestion(pendingDelete.questionId);
        } else {
            onRemoveSubquestion(pendingDelete.parentId, pendingDelete.subId);
        }

        setPendingDelete(null);
    };

    const handleCancelDelete = () => setPendingDelete(null);

    useEffect(() => {
        if (!isComponentPaletteDrag && paletteDropTarget) {
            setPaletteDropTarget(null);
        }
        if (!isComponentPaletteDrag && paletteContainerTargetId) {
            setPaletteContainerTargetId(null);
        }
    }, [isComponentPaletteDrag, paletteDropTarget, paletteContainerTargetId]);

    const canReceivePaletteDrop = (parent: Question, _parentDepth: number) => {
        const parentHasSubquestions = parent.subquestions && parent.subquestions.length > 0;
        if (!isSectionType(parent.type) && !parentHasSubquestions) return false;
        if (!isSectionType(parent.type) && !isChoiceType(parent.type)) return false;
        if (!paletteDragType) return false;
        return IsValidChild(parent.type, paletteDragType);
    };

    const canReceivePaletteDropType = (parent: Question, type: Question['type']) => {
        const parentHasSubquestions = parent.subquestions && parent.subquestions.length > 0;
        if (!isSectionType(parent.type) && !parentHasSubquestions) return false;
        if (!isSectionType(parent.type) && !isChoiceType(parent.type)) return false;
        return IsValidChild(parent.type, type);
    };

    const handlePaletteContainerDragOver = (
        event: React.DragEvent,
        parent: Question,
    ) => {
        if (!paletteMime || !event.dataTransfer.types.includes(paletteMime)) return;
        const type = event.dataTransfer.getData(paletteMime) as Question['type'];
        if (!type) return;
        if (!canReceivePaletteDropType(parent, type)) return;

        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        setPaletteContainerTargetId(parent.id);
    };

    const handlePaletteContainerDragLeave = (
        event: React.DragEvent,
        parentId: string,
    ) => {
        const next = event.relatedTarget as Node | null;
        if (next && event.currentTarget.contains(next)) return;
        setPaletteContainerTargetId((prev) => (prev === parentId ? null : prev));
    };

    const handlePaletteContainerDrop = (
        event: React.DragEvent,
        parent: Question,
    ) => {
        if (!paletteMime || !event.dataTransfer.types.includes(paletteMime)) return;
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
        slotIndex: number,
    ) => {
        if (!paletteMime || !event.dataTransfer.types.includes(paletteMime)) return;
        if (!canReceivePaletteDrop(parent, parentDepth)) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        setPaletteDropTarget((prev) => {
            if (prev && prev.parentId === parent.id && prev.slot === slotIndex) return prev;
            return { parentId: parent.id, slot: slotIndex };
        });
    };

    const handlePaletteSlotDragLeave = (
        event: React.DragEvent,
        parentId: string,
        slotIndex: number,
    ) => {
        const next = event.relatedTarget as Node | null;
        if (next && event.currentTarget.contains(next)) return;
        setPaletteDropTarget((prev) => {
            if (!prev) return prev;
            if (prev.parentId === parentId && prev.slot === slotIndex) return null;
            return prev;
        });
    };

    const handlePaletteSlotDrop = (
        event: React.DragEvent,
        parent: Question,
        parentDepth: number,
        slotIndex: number,
    ) => {
        if (!paletteMime || !event.dataTransfer.types.includes(paletteMime)) return;
        if (!canReceivePaletteDrop(parent, parentDepth)) return;
        event.preventDefault();
        event.stopPropagation();
        setPaletteDropTarget(null);
        const type = event.dataTransfer.getData(paletteMime) as Question['type'];
        if (!type) return;
        onInsertSubquestionFromPalette?.(parent.id, slotIndex, type);
    };

    const renderPaletteSlot = (
        parent: Question,
        parentDepth: number,
        slotIndex: number,
    ): React.ReactNode => {
        if (!onInsertSubquestionFromPalette) return null;
        if (!isComponentPaletteDrag) return null;
        if (!canReceivePaletteDrop(parent, parentDepth)) return null;

        const isActive =
            paletteDropTarget?.parentId === parent.id &&
            paletteDropTarget.slot === slotIndex;

        return (
            <PaletteSlotBox
                key={`${parent.id}-palette-slot-${slotIndex}`}
                $isActive={isActive}
                onDragOver={(event) =>
                    handlePaletteSlotDragOver(event, parent, parentDepth, slotIndex)
                }
                onDragLeave={(event) =>
                    handlePaletteSlotDragLeave(event, parent.id, slotIndex)
                }
                onDrop={(event) =>
                    handlePaletteSlotDrop(event, parent, parentDepth, slotIndex)
                }
            >
                <Typography variant="caption" color="primary.dark">
                    Drop here
                </Typography>
            </PaletteSlotBox>
        );
    };

    const handleSubDragStart = (
        event: React.DragEvent,
        parentId: string,
        index: number,
        subId: string,
    ) => {
        event.stopPropagation();
        setSolidDragPreview(event as React.DragEvent<HTMLElement>, dragPreviewRef);
        event.dataTransfer.setData(
            SUBQUESTION_DND_MIME,
            JSON.stringify({ parentId, index }),
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

    const handleSubDragOver = (event: React.DragEvent, subId: string) => {
        if (!subDragState.dragging) return;
        event.preventDefault();
        if (subDragState.over !== subId) {
            setSubDragState((prev) => ({ ...prev, over: subId, slot: null }));
        }
    };

    const handleSubDrop = (
        event: React.DragEvent,
        parentId: string,
        targetIndex: number,
    ) => {
        event.preventDefault();
        event.stopPropagation();
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
        cleanupDragPreview(dragPreviewRef);
        setSubDragState({
            dragging: null,
            parentId: null,
            fromIndex: -1,
            over: null,
            slot: null,
        });
    };

    const handleQuestionDragStart = (event: React.DragEvent<HTMLElement>) => {
        setSolidDragPreview(event, dragPreviewRef);
        onDragHandleStart?.(event);
    };

    const handleQuestionDragEnd = () => {
        cleanupDragPreview(dragPreviewRef);
        onDragHandleEnd?.();
    };

    const handleSubSlotDragOver = (
        event: React.DragEvent,
        parentId: string,
        slotIndex: number,
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
            if (prev.slot === slotIndex) return prev;
            return { ...prev, slot: slotIndex, over: null };
        });
    };

    const handleSubSlotDragLeave = (
        event: React.DragEvent,
        parentId: string,
        slotIndex: number,
    ) => {
        const next = event.relatedTarget as Node | null;
        if (next && event.currentTarget.contains(next)) return;
        setSubDragState((prev) => {
            if (prev.parentId === parentId && prev.slot === slotIndex) {
                return { ...prev, slot: null };
            }
            return prev;
        });
    };

    const handleSubSlotDrop = (
        event: React.DragEvent,
        parentId: string,
        slotIndex: number,
    ) => {
        if (
            !subDragState.dragging ||
            subDragState.parentId !== parentId ||
            !event.dataTransfer.types.includes(SUBQUESTION_DND_MIME)
        ) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        const fromIndex = subDragState.fromIndex;
        if (fromIndex === -1) return;
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
        slotIndex: number,
    ): React.ReactNode => {
        if (!subDragState.dragging || subDragState.parentId !== parentId) return null;
        const isActive =
            subDragState.slot === slotIndex && subDragState.parentId === parentId;

        return (
            <ReorderSlotBox
                key={`${parentId}-reorder-slot-${slotIndex}`}
                $isActive={isActive}
                onDragOver={(event) =>
                    handleSubSlotDragOver(event, parentId, slotIndex)
                }
                onDragLeave={(event) =>
                    handleSubSlotDragLeave(event, parentId, slotIndex)
                }
                onDrop={(event) => handleSubSlotDrop(event, parentId, slotIndex)}
            >
                {isActive && (
                    <Typography
                        variant="caption"
                        color="primary.dark"
                        display="block"
                        textAlign="center"
                        sx={{ py: 0.5 }}
                    >
                        Drop to reorder
                    </Typography>
                )}
            </ReorderSlotBox>
        );
    };

    const renderChoiceOptions = (target: Question) => (
        <QuestionOptionsEditor
            target={target}
            onFieldChange={onFieldChange}
            onAddOption={onAddOption}
            onOptionChange={onOptionChange}
        />
    );

    if (!question) {
        return (
            <EmptyStatePaper>
                <Typography variant="body2" color="text.secondary">
                    No questions yet. Click &ldquo;Add Question&rdquo; to start building
                    your module.
                </Typography>
            </EmptyStatePaper>
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
            <PlaceholderPaper onDragOver={handleDragOver} onDrop={handleDrop}>
                <DragIndicatorIcon sx={{ fontSize: 40, opacity: 0.3, mb: 1 }} />
                <Typography variant="subtitle1" color="text.secondary">
                    Drop Question Type Here
                </Typography>
                <Button
                    color="error"
                    onClick={() => requestQuestionDelete(question.id)}
                    sx={{ mt: 2 }}
                >
                    Cancel
                </Button>
            </PlaceholderPaper>
        );
    }

    const renderContainerDropHint = (
        parent: Question,
        mode: 'empty' | 'append' = 'empty',
    ) => {
        const hint = allowedTypeHint(parent.type);
        if (!hint) return null;

        const isActive = paletteContainerTargetId === parent.id;
        const label =
            mode === 'append'
                ? `Drag ${hint} here to add another item`
                : `Drag ${hint} here`;

        return (
            <DropHintBox
                $isActive={isActive}
                onDragOver={(event) => handlePaletteContainerDragOver(event, parent)}
                onDragLeave={(event) => handlePaletteContainerDragLeave(event, parent.id)}
                onDrop={(event) => handlePaletteContainerDrop(event, parent)}
            >
                <Typography
                    variant="body2"
                    color={isActive ? 'primary.dark' : 'text.secondary'}
                >
                    {label}
                </Typography>
            </DropHintBox>
        );
    };

    const renderSubquestion = (
        sub: Question,
        numbering: string,
        depth: number,
        parentId: string,
        subIndex: number,
    ): React.ReactNode => {
        const isLeaf = !sub.subquestions || sub.subquestions.length === 0;
        const isDragTarget = subDragState.over === sub.id;
        const isSubDragging = subDragState.dragging === sub.id;
        const isVideoSub = sub.type === 'video';
        const isPdfSub = sub.type === 'pdf';
        const isMediaSub = isVideoSub || isPdfSub;
        const subVisual = getTypeVisual(sub.type);

        let subQuestionLabel = 'Nested Question Text';
        let subQuestionPlaceholder = 'Enter the nested question prompt...';

        if (isMediaSub) {
            subQuestionLabel = 'Section Prompt';
            subQuestionPlaceholder = 'Enter section heading and instructions...';
        } else if (depth === 1) {
            subQuestionLabel = 'Subquestion Text';
            subQuestionPlaceholder = 'Enter the supporting question prompt...';
        }

        return (
            <SubquestionPaper
                key={sub.id}
                $isDragging={isSubDragging}
                $isDragTarget={isDragTarget}
                $borderColor={subVisual.borderColor}
                draggable
                onDragStart={(event) =>
                    handleSubDragStart(event, parentId, subIndex, sub.id)
                }
                onDragOver={(event) => handleSubDragOver(event, sub.id)}
                onDrop={(event) => handleSubDrop(event, parentId, subIndex)}
                onDragEnd={handleSubDragEnd}
            >
                <SubHeaderBar
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    sx={{ bgcolor: subVisual.headerBg }}
                >
                    <DragIndicatorIcon fontSize="small" color="disabled" />
                    <Typography variant="subtitle2" fontWeight={700}>
                        Editing Question {numbering}
                    </Typography>
                    <Chip size="small" label={subVisual.label} color={subVisual.chipColor} />
                </SubHeaderBar>

                <QuestionRichTextField
                    label={subQuestionLabel}
                    value={sub.questionText ?? ''}
                    placeholder={subQuestionPlaceholder}
                    minHeight={depth > 1 ? 150 : 180}
                    showToolbar={depth <= 1}
                    onChange={(value) => onFieldChange(sub.id, 'questionText', value)}
                />

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

                <QuestionTypeSelector
                    questionId={sub.id}
                    type={sub.type}
                    weight={sub.weight}
                    showWeight
                    questionTypeOptions={questionTypeOptions}
                    filterOptions={(type) => {
                        if (question.type === 'group') return true;
                        return type !== 'video' && type !== 'pdf';
                    }}
                    onTypeChange={onTypeChange}
                    onWeightChange={onWeightChange}
                />

                {isLeaf && isChoiceType(sub.type) && renderChoiceOptions(sub)}

                {isSectionType(sub.type) && (
                    <Box sx={{ borderLeft: '2px solid', borderColor: 'divider', pl: 2, mt: 1 }}>
                        {(sub.subquestions ?? []).length === 0 &&
                            renderContainerDropHint(sub, 'empty')}
                        {renderSubquestionList(sub, depth, numbering)}
                        {(sub.subquestions ?? []).length > 0 &&
                            renderContainerDropHint(sub, 'append')}
                    </Box>
                )}

                <Stack direction="row" spacing={1} mt={2} alignItems="center">
                    <Box flexGrow={1} />
                    <IconButton
                        color="error"
                        onClick={() => requestSubquestionDelete(parentId, sub.id)}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Stack>
            </SubquestionPaper>
        );
    };

    const renderSubquestionList = (
        parent: Question,
        parentDepth: number,
        numberingPrefix: string,
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
            if (slot) elements.push(slot);
            elements.push(
                renderSubquestion(
                    subquestion,
                    `${resolvedPrefix}.${idx + 1}`,
                    parentDepth + 1,
                    parent.id,
                    idx,
                ),
            );
        });

        const tailSlot = showingReorderSlots
            ? renderSubReorderSlot(parent.id, subs.length)
            : renderPaletteSlot(parent, parentDepth, subs.length);
        if (tailSlot) elements.push(tailSlot);

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
    const questionVisual = getTypeVisual(question.type);
    let questionTitle = 'Question';
    if (isSection && !isGroup) {
        questionTitle = 'Section';
    }

    return (
        <QuestionPaper
            $isDragging={isDragging}
            $borderColor={questionVisual.borderColor}
            draggable={Boolean(onDragHandleStart)}
            onDragStart={handleQuestionDragStart}
            onDragEnd={handleQuestionDragEnd}
            key={question.id}
        >
            <HeaderBar
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                $isDragging={isDragging}
                $headerBg={questionVisual.headerBg}
            >
                <DragIndicatorIcon fontSize="small" />
                <Typography variant="subtitle1" fontWeight={700}>
                    {`Editing ${questionTitle} ${numberingLabel}`}
                </Typography>
                <Chip size="small" color={questionVisual.chipColor} label={questionVisual.label} />
                {isSection && hasSubquestions && (
                    <Typography variant="caption" color="text.secondary">
                        Total Weight: {computeTotalWeight(question)}
                    </Typography>
                )}
                <Box flexGrow={1} />
            </HeaderBar>
            {isSection ? (
                <>
                    <QuestionRichTextField
                        label={isGroup ? 'Question Text' : 'Section Prompt'}
                        value={question.questionText ?? ''}
                        placeholder={
                            isGroup
                                ? 'Enter the question prompt...'
                                : 'Enter section heading and instructions...'
                        }
                        onChange={(value) =>
                            onFieldChange(question.id, 'questionText', value)
                        }
                    />
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
                    <QuestionTypeSelector
                        questionId={question.id}
                        type={question.type}
                        weight={question.weight}
                        showWeight={!isSection && !hasSubquestions}
                        questionTypeOptions={questionTypeOptions}
                        onTypeChange={onTypeChange}
                        onWeightChange={onWeightChange}
                    />

                    {isChoiceType(question.type) &&
                        !hasSubquestions &&
                        renderChoiceOptions(question)}
                </>
            )}

            <Stack direction="row" spacing={1} mt={2} alignItems="center">
                {isSection && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onAddSubquestion(question.id)}
                    >
                        Add Question to Section
                    </Button>
                )}
                {!isSection && isChoiceType(question.type) && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onAddSubquestion(question.id)}
                    >
                        Add Sub-questions
                    </Button>
                )}
                <Box flexGrow={1} />
                <IconButton
                    color="error"
                    onClick={() => requestQuestionDelete(question.id)}
                >
                    <DeleteIcon />
                </IconButton>
            </Stack>

            {isSection && (
                <ContainerBranch>
                    {(question.subquestions ?? []).length === 0 &&
                        renderContainerDropHint(question, 'empty')}
                    {renderSubquestionList(question, 0, childPrefixRoot)}
                    {(question.subquestions ?? []).length > 0 &&
                        renderContainerDropHint(question, 'append')}
                    {!isGroup && (
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 1 }}
                            size="small"
                            onClick={() => onAddSubquestion(question.id)}
                        >
                            Add Another Question to {isGroup ? 'Question' : 'Section'}
                        </Button>
                    )}
                </ContainerBranch>
            )}

            {!isSection && isChoiceType(question.type) && hasSubquestions && (
                <ContainerBranch>
                    {renderSubquestionList(question, 0, childPrefixRoot)}
                    {(question.subquestions ?? []).length > 0 &&
                        renderContainerDropHint(question, 'append')}
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 1 }}
                        size="small"
                        onClick={() => onAddSubquestion(question.id)}
                    >
                        Add Another Sub-question
                    </Button>
                </ContainerBranch>
            )}

            <ConfirmDialog
                open={Boolean(pendingDelete)}
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title={
                    pendingDelete?.kind === 'subquestion'
                        ? 'Delete sub-question?'
                        : 'Delete question?'
                }
                description={
                    pendingDelete?.kind === 'subquestion'
                        ? 'Are you sure you want to delete this sub-question? This action cannot be undone.'
                        : 'Are you sure you want to delete this question? This action cannot be undone.'
                }
                confirmText="Delete"
                confirmButtonProps={{ variant: 'contained', color: 'error' }}
            />
        </QuestionPaper>
    );
};

export default QuestionEditorPanel;
