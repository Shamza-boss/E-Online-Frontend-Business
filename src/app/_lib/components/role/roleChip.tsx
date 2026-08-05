'use client';

import Chip from '@mui/material/Chip';
import { type UserRole } from '../../Enums/UserRole';
import { getRoleChipConfig } from '../../common/functions';

type RoleChipProps = {
  role: UserRole;
}

export function RoleChip({ role }: RoleChipProps) {
  const { label, color } = getRoleChipConfig(role);
  return <Chip size="small" label={label} color={color} variant="outlined" />;
}
