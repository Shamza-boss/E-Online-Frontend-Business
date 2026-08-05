import type { ChipProps } from '@mui/material/Chip';
import { type UserRole } from '@/app/_lib/Enums/UserRole';

export type ChipTone = ChipProps['color'];

export type RoleGuidanceCard = {
  title: string;
  role: UserRole;
  summary: string;
  actions: string[];
}

export type RoleKey = UserRole | 'default';

export type RoleTheme = {
  chipColor: ChipTone;
  accent: string;
  gradient: string;
  surface: string;
  border: string;
}

export type AccessMode = 'govern' | 'create' | 'complete' | 'view' | 'none';

export type ViewCapability = {
  role: UserRole;
  capability: string;
  detail: string;
  mode: AccessMode;
}

export type ViewGuidanceEntry = {
  title: string;
  description: string;
  capabilities: ViewCapability[];
}

export type AccessModeMeta = {
  label: string;
  color: ChipProps['color'];
  variant: ChipProps['variant'];
  Icon: React.ElementType;
}
