import type { InstitutionOption } from '../BillingExperience/types';

export type BillingToolbarProps = {
  institutionOptions: InstitutionOption[];
  selectedInstitutionId: string | null;
  selectedOption?: InstitutionOption;
  institutionsLoading: boolean;
  institutionsError: boolean;
  generating: boolean;
  togglingStatus: boolean;
  onSelectInstitution: (id: string) => void;
  onToggleInstitutionStatus: () => void;
  onGenerateInvoice: () => void;
};
