import React from 'react';
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
} from '@mui/material';
import type { Question } from '../../../../../../../_lib/interfaces/types';
import QuestionTextDisplay from '@/app/_lib/components/TipTapEditor/QuestionTextDisplay';
import { VideoPlayer } from '@/app/_lib/components/video/VideoPlayer';
import { extractPlainText } from '@/app/_lib/utils/textUtils';
import { computeTotalWeight } from '../../utils';
import {
  NodeCard,
  FlexWrapRow,
  MultiSelectColumn,
  AnswerArea,
  VideoWrapper,
} from '../../elements';
import PdfAttachment from '../PdfAttachment';

export interface QuestionNodeProps {
  node: Question;
  numbering: string;
  depth?: number;
  answers: Record<string, unknown>;
  readOnly: boolean;
  onChange: (questionId: string, value: unknown) => void;
  onMultiSelectToggle: (questionId: string, option: string, checked: boolean) => void;
  onOpenPdf: (title: string, pdf?: Question['pdf']) => void;
}

export default function QuestionNode({
  node,
  numbering,
  depth = 1,
  answers,
  readOnly,
  onChange,
  onMultiSelectToggle,
  onOpenPdf,
}: QuestionNodeProps) {
  const textVariant = depth === 1 ? 'h6' : 'subtitle1';

  const createMultiSelectHandler = (questionId: string, option: string) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      onMultiSelectToggle(questionId, option, event.target.checked);
    };
  };

  if (node.subquestions && node.subquestions.length > 0) {
    const sectionWeight = computeTotalWeight(node);
    return (
      <NodeCard key={node.id} depth={depth}>
        <FlexWrapRow>
          <Typography variant={textVariant} fontWeight={600}>
            {numbering}.
          </Typography>
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
              ({sectionWeight} marks)
            </Typography>
          )}
        </FlexWrapRow>
        {node.type === 'video' && (
          <VideoWrapper>
            {node.video ? (
              <VideoPlayer video={node.video} />
            ) : (
              <Typography variant="body2" color="text.secondary">
                Video unavailable
              </Typography>
            )}
          </VideoWrapper>
        )}
        {node.type === 'pdf' && (
          <PdfAttachment
            title={extractPlainText(node.questionText) || 'PDF section'}
            pdf={node.pdf}
            onOpen={onOpenPdf}
          />
        )}
        {node.subquestions.map((sub, idx) => (
          <QuestionNode
            key={sub.id}
            node={sub}
            numbering={`${numbering}.${idx + 1}`}
            depth={depth + 1}
            answers={answers}
            readOnly={readOnly}
            onChange={onChange}
            onMultiSelectToggle={onMultiSelectToggle}
            onOpenPdf={onOpenPdf}
          />
        ))}
      </NodeCard>
    );
  }

  const opts = node.options ?? [];

  return (
    <NodeCard key={node.id} depth={depth}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <FlexWrapRow>
          <Typography variant={textVariant}>{numbering}.</Typography>
          <QuestionTextDisplay
            content={node.questionText}
            fallback="Untitled question"
            variant={textVariant}
            component="span"
            sx={{ flex: 1, minWidth: 0 }}
          />
        </FlexWrapRow>
        <Typography variant="caption" color="text.secondary">
          ({Number.isFinite(node.weight) ? node.weight : 0} marks)
        </Typography>
      </Box>
      <AnswerArea>
        {(() => {
          if (node.type === 'single-select') {
            return (
              <RadioGroup
                value={(answers[node.id] as string) || ''}
                onChange={(e) => onChange(node.id, e.target.value)}
                row
              >
                {opts.length > 0 ? (
                  opts.map((option, idx) => (
                    <FormControlLabel
                      key={`${node.id}-single-${option}-${idx}`}
                      value={option}
                      control={<Radio disabled={readOnly} />}
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
            return opts.length > 0 ? (
              <MultiSelectColumn>
                {opts.map((option, idx) => (
                  <FormControlLabel
                    key={`${node.id}-multi-${option}-${idx}`}
                    control={
                      <Checkbox
                        disabled={readOnly}
                        checked={
                          Array.isArray(answers[node.id])
                            ? (answers[node.id] as string[]).includes(option)
                            : false
                        }
                        onChange={createMultiSelectHandler(node.id, option)}
                      />
                    }
                    label={option || `Option ${idx + 1}`}
                  />
                ))}
              </MultiSelectColumn>
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
            return (
              <PdfAttachment
                title={extractPlainText(node.questionText) || 'PDF question'}
                pdf={node.pdf}
                compact
                onOpen={onOpenPdf}
              />
            );
          }
          return (
            <Typography variant="body2" color="text.secondary">
              Unsupported question type
            </Typography>
          );
        })()}
      </AnswerArea>
    </NodeCard>
  );
}
