import CreditCardIcon from '@mui/icons-material/CreditCard';

export const BILLING_TITLE = 'Billing & Invoicing';
export const BILLING_DESCRIPTION =
  'Select an institution, review its charges, generate the invoice, then send or mark it paid.';
export const BILLING_INFO_ARIA = 'About billing and invoicing';

export const SECTION_OVERVIEW = {
  title: 'Billing snapshot',
  description: 'Live charges for the selected institution this billing month.',
} as const;

export const SECTION_RATES = {
  title: 'Pricing controls',
  description: 'Adjust what gets included on their next invoice.',
} as const;

export const SECTION_PROJECTION = {
  title: 'Usage projection',
  description: 'Estimated next invoice based on current usage and rates.',
} as const;

export const SECTION_INVOICES = {
  title: 'Invoice history',
  description: 'Send, download, mark paid, or cancel invoices for this institution.',
} as const;

export { CreditCardIcon };
