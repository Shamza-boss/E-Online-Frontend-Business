'use client';

import Chip from '@mui/material/Chip';
import { UserRole } from '../../Enums/UserRole';
import { getRoleChipConfig } from '../../common/functions';

interface RoleChipProps {
  role: UserRole;
}

export function RoleChip({ role }: RoleChipProps) {
  const { label, color } = getRoleChipConfig(role);
  return <Chip size="small" label={label} color={color} variant="outlined" />;
}
