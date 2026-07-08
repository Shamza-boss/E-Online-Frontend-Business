import type { ChipProps } from '@mui/material/Chip';
import { UserRole } from '@/app/_lib/Enums/UserRole';

export type ChipTone = ChipProps['color'];

export interface RoleGuidanceCard {
  title: string;
  role: UserRole;
  summary: string;
  actions: string[];
}

export type RoleKey = UserRole | 'default';

export interface RoleTheme {
  chipColor: ChipTone;
  accent: string;
  gradient: string;
  surface: string;
  border: string;
}

export type AccessMode = 'govern' | 'create' | 'complete' | 'view' | 'none';

export interface ViewCapability {
  role: UserRole;
  capability: string;
  detail: string;
  mode: AccessMode;
}

export interface ViewGuidanceEntry {
  title: string;
  description: string;
  capabilities: ViewCapability[];
}

export interface AccessModeMeta {
  label: string;
  color: ChipProps['color'];
  variant: ChipProps['variant'];
  Icon: React.ElementType;
}
