import { Stack, IconButton, Typography, Button } from '@mui/material';
import { alpha } from '@mui/material/styles';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import type { Question } from '../../../../../../../_lib/interfaces/types';
import type { HomeworkAnswersMap } from '../../types';
import { COVER_PAGE } from '../../constants';
import { isNodeCompleted } from '../../utils';
import {
  FooterBar,
  FooterProgressBar,
  DotStepper,
  StepPill,
} from '../../elements';

export type HomeworkFooterProps = {
  sortedQuestions: Question[];
  answers: HomeworkAnswersMap;
  currentPage: number;
  safeIndex: number;
  totalQuestions: number;
  answeredCount: number;
  completionPercent: number;
  readOnly: boolean;
  onPageChange: (page: number) => void;
  onSubmit: (e?: React.FormEvent) => void;
};

export default function HomeworkFooter({
  sortedQuestions,
  answers,
  currentPage,
  safeIndex,
  totalQuestions,
  answeredCount,
  completionPercent,
  readOnly,
  onPageChange,
  onSubmit,
}: HomeworkFooterProps) {
  return (
    <FooterBar>
      <Stack spacing={0.75}>
        <FooterProgressBar
          variant="determinate"
          color="success"
          value={completionPercent}
        />
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton
            size="small"
            disabled={currentPage <= COVER_PAGE}
            onClick={() => onPageChange(Math.max(COVER_PAGE, currentPage - 1))}
            sx={{
              border: (t) => `1px solid ${alpha(t.palette.divider, 0.6)}`,
              borderRadius: 1,
              p: 0.5,
            }}
          >
            <NavigateBeforeRoundedIcon fontSize="small" />
          </IconButton>

          <DotStepper>
            {sortedQuestions.map((q, i) => (
              <StepPill
                key={q.id}
                completed={isNodeCompleted(q, answers)}
                active={i === safeIndex}
                onClick={() => onPageChange(i)}
              >
                {i + 1}
              </StepPill>
            ))}
          </DotStepper>

          <IconButton
            size="small"
            disabled={safeIndex >= totalQuestions - 1}
            onClick={() =>
              onPageChange(Math.min(totalQuestions - 1, currentPage + 1))
            }
            sx={{
              border: (t) => `1px solid ${alpha(t.palette.divider, 0.6)}`,
              borderRadius: 1,
              p: 0.5,
            }}
          >
            <NavigateNextRoundedIcon fontSize="small" />
          </IconButton>

          <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
            {answeredCount}/{totalQuestions}
          </Typography>

          {!readOnly && (
            <Button
              color="success"
              variant="contained"
              size="small"
              onClick={(e) => onSubmit(e)}
              sx={{ fontWeight: 700, ml: 'auto' }}
            >
              Submit
            </Button>
          )}
        </Stack>
      </Stack>
    </FooterBar>
  );
}
