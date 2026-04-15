export interface BillingRatesPanelProps {
  institutionName?: string;
  creatorEnabled: boolean;
  loading?: boolean;
  disabled?: boolean;
  onToggleCreator: (enabled: boolean) => Promise<void>;
}
