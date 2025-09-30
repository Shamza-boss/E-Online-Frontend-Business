import { UserRole } from '../Enums/UserRole';
import { UserDto } from '../interfaces/types';
import { ChipProps } from '@mui/material/Chip';

export const roleMap: Record<UserRole, string> = {
  [UserRole.Admin]: 'Admin',
  [UserRole.Student]: 'Student',
  [UserRole.Teacher]: 'Teacher',
  [UserRole.AdmissionsVerifier]: 'Admissions Verifier',
  [UserRole.Auditor]: 'Auditor',
  [UserRole.Moderator]: 'Moderator',
  [UserRole.Parent]: 'Parent',
  [UserRole.PlatformAdmin]: 'Platform Admin',
};

//Sidebar route labels
export const routeLabels: Record<string, string> = {
  '': 'Dashboard',
  management: 'Management',
  institutions: 'Institutions',
  'manage-classes': 'Manage classes',
  classes: 'My classes',
  settings: 'Settings',
};

export const roleOptions = [
  { value: UserRole.Admin, label: 'Admin' },
  { value: UserRole.Student, label: 'Student' },
  { value: UserRole.Teacher, label: 'Teacher' },
  { value: UserRole.AdmissionsVerifier, label: 'Admissions Verifier' },
  { value: UserRole.Auditor, label: 'Auditor' },
  { value: UserRole.Moderator, label: 'Moderator' },
  { value: UserRole.Parent, label: 'Parent' },
  { value: UserRole.PlatformAdmin, label: 'Platform Admin' },
];

export function getAllowedRoles(editorRole: UserRole, targetRow: UserDto) {
  if (editorRole == UserRole.Admin) {
    if (targetRow.role == UserRole.Admin) return [];
    return roleOptions.filter((r) => r.value !== UserRole.Admin);
  } else if (editorRole == UserRole.Moderator) {
    if (
      targetRow.role == UserRole.Admin ||
      targetRow.role === UserRole.Moderator
    )
      return [];
    return roleOptions.filter(
      (r) => r.value !== UserRole.Admin && r.value !== UserRole.Moderator
    );
  }
  return [];
}

interface RoleChipConfig {
  label: string;
  color: ChipProps['color']; // e.g. 'primary', 'error', etc.
}

export function getRoleChipConfig(role: UserRole): RoleChipConfig {
  switch (role) {
    case UserRole.Admin:
      return { label: 'Admin', color: 'error' };
    case UserRole.Student:
      return { label: 'Student', color: 'primary' };
    case UserRole.Teacher:
      return { label: 'Teacher', color: 'success' };
    case UserRole.AdmissionsVerifier:
      return { label: 'Admissions Verifier', color: 'info' };
    case UserRole.Auditor:
      return { label: 'Auditor', color: 'secondary' };
    case UserRole.Moderator:
      return { label: 'Moderator', color: 'warning' };
    case UserRole.Parent:
      return { label: 'Parent', color: 'default' };
    case UserRole.PlatformAdmin:
      return { label: 'Platform Admin', color: 'default' };
    default:
      // Fallback if something new or unknown
      return { label: 'Unknown', color: 'default' };
  }
}

interface StatusChipConfig {
  label: string;
  color: ChipProps['color']; // e.g., 'primary', 'error', etc.
}

export function getStatusChipConfig(
  isGraded: boolean,
  isSubmitted: boolean,
  dueDate: string
): StatusChipConfig {
  const currentDate = new Date();
  const assignmentDueDate = new Date(dueDate);

  // Overdue if the assignment is not submitted and the due date has passed
  if (!isSubmitted && assignmentDueDate < currentDate) {
    return { label: 'Overdue', color: 'error' };
  } else if (isGraded) {
    return { label: 'Graded', color: 'success' };
  } else if (isSubmitted) {
    return { label: 'Submitted', color: 'info' };
  } else {
    return { label: 'Pending', color: 'warning' };
  }
}

/**
 * Compute SHA-256 hash of a File and return it as a hex string.
 */
export async function hashFile(file: File): Promise<string> {
  // 1. Read file into an ArrayBuffer
  const buffer = await file.arrayBuffer();

  // 2. Use the SubtleCrypto API to hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);

  // 3. Convert ArrayBuffer to byte array
  const byteArray = new Uint8Array(hashBuffer);

  // 4. Convert each byte to a 2-digit hex string and join
  return Array.from(byteArray)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
