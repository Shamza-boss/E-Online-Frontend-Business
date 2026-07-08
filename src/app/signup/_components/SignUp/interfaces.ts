export interface SignUpForm {
  email: string;
  terms?: boolean;
}

export type ShowAlertFn = (
  severity: 'error' | 'info' | 'success' | 'warning',
  message: string,
) => void;
