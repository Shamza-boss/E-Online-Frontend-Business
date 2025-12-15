import type { ChipProps } from '@mui/material/Chip';
import { UserRole } from '@/app/_lib/Enums/UserRole';

export type ChipTone = ChipProps['color'];

export type RoleKey = UserRole | 'default';

export interface RoleTheme {
  chipColor: ChipTone;
  accent: string;
  gradient: string;
  surface: string;
  border: string;
}
