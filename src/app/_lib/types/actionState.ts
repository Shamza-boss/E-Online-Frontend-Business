import type { SubmissionResult } from '@conform-to/react';

/**
 * Shared Server Action state for useActionState + Conform forms.
 */
export type FormActionError = { status: 'error'; message: string };

export type FormActionState<TSuccess> =
  | SubmissionResult<string[]>
  | { status: 'success'; data: TSuccess }
  | FormActionError;

export type FormActionPrevState<TSuccess> = FormActionState<TSuccess> | null;

export function isFormActionSuccess<TData>(
  result: FormActionState<TData> | null | undefined,
): result is { status: 'success'; data: TData } {
  return (
    result !== null &&
    result !== undefined &&
    typeof result === 'object' &&
    'status' in result &&
    result.status === 'success' &&
    'data' in result
  );
}

export type InstitutionSubmitResult =
  | SubmissionResult<string[]>
  | { success: true; institution: string }
  | { success: false; error: string };

export function isInstitutionSubmitSuccess(
  result: InstitutionSubmitResult | null | undefined,
): result is { success: true; institution: string } {
  return (
    result !== null &&
    result !== undefined &&
    typeof result === 'object' &&
    'success' in result &&
    result.success === true
  );
}
