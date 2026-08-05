export type SignInForm = {
  email: string;
}

export type ResolvedUser = {
  isInstitutionActive?: boolean;
  IsInstitutionActive?: boolean;
  primaryAdminEmail?: string | null;
  PrimaryAdminEmail?: string | null;
}

export type ShowAlertFn = (
  severity: 'error' | 'info' | 'success' | 'warning',
  message: string,
) => void;
