import { UserRole } from '../Enums/UserRole';
import { UserDto } from '../interfaces/types';
import { ChipProps } from '@mui/material/Chip';

export const roleMap: Record<UserRole, string> = {
  [UserRole.Admin]: 'Admin',
  [UserRole.Trainee]: 'Trainee',
  [UserRole.Instructor]: 'Instructor',
  [UserRole.PlatformAdmin]: 'Platform Admin',
};

//Sidebar route labels
export const routeLabels: Record<string, string> = {
  '': 'Dashboard',
  management: 'Management',
  institutions: 'Institutions',
  'manage-courses': 'Manage courses',
  library: 'Library',
  courses: 'My courses',
  settings: 'Settings',
};

export const roleOptions = [
  { value: UserRole.Admin, label: 'Admin' },
  { value: UserRole.Trainee, label: 'Trainee' },
  { value: UserRole.Instructor, label: 'Instructor' },
  { value: UserRole.PlatformAdmin, label: 'Platform Admin' },
];

export function getAllowedRoles(editorRole: UserRole, targetRow: UserDto) {
  if (editorRole == UserRole.Admin) {
    if (targetRow.role == UserRole.Admin) return [];
    return roleOptions.filter((r) => r.value !== UserRole.Admin);
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
    case UserRole.Trainee:
      return { label: 'Trainee', color: 'primary' };
    case UserRole.Instructor:
      return { label: 'Instructor', color: 'success' };
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
