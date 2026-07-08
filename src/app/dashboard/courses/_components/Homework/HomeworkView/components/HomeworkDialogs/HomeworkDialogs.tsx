import ConfirmDialog from '@/app/_lib/components/dialog/ConfirmDialog';

export interface HomeworkDialogsProps {
  showSubmitConfirm: boolean;
  showBackWarning: boolean;
  answeredCount: number;
  totalQuestions: number;
  onConfirmSubmit: () => void;
  onCancelSubmit: () => void;
  onConfirmBack: () => void;
  onCancelBack: () => void;
}

export default function HomeworkDialogs({
  showSubmitConfirm,
  showBackWarning,
  answeredCount,
  totalQuestions,
  onConfirmSubmit,
  onCancelSubmit,
  onConfirmBack,
  onCancelBack,
}: HomeworkDialogsProps) {
  const unanswered = totalQuestions - answeredCount;

  return (
    <>
      <ConfirmDialog
        open={showSubmitConfirm}
        title="Submit Assessment"
        description={
          <>
            You have answered <strong>{answeredCount}</strong> of{' '}
            <strong>{totalQuestions}</strong> questions.
            {unanswered > 0 && (
              <>
                {' '}
                <strong>
                  {unanswered} question{unanswered !== 1 ? 's' : ''}
                </strong>{' '}
                remaining unanswered.
              </>
            )}
            <br />
            <br />
            <strong>This action cannot be undone.</strong> Once submitted, you will not be
            able to make changes to your answers.
          </>
        }
        confirmText="Submit"
        cancelText="Continue Working"
        onConfirm={onConfirmSubmit}
        onCancel={onCancelSubmit}
      />

      <ConfirmDialog
        open={showBackWarning}
        title="Leave Assessment?"
        description={
          <>
            You will lose all your changes if you leave. Your assessment will be
            submitted with <strong>no questions completed</strong>.
          </>
        }
        confirmText="Leave"
        cancelText="Stay"
        onConfirm={onConfirmBack}
        onCancel={onCancelBack}
      />
    </>
  );
}
