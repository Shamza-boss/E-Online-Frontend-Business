import { alpha, type Theme } from '@mui/material/styles';
import { getRoleChipConfig } from '@/app/_lib/common/functions';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import type { SettingsResponseDto } from '@/app/_lib/interfaces/types';
import { COMPACT_METRIC_NUMBER } from './constants';
import type { AccessMode, AccessModeMeta, ChipTone, RoleKey, RoleTheme } from './types';
import { ACCESS_MODE_META_MAP } from './constants';

export function extractRoleValue(
  role: SettingsResponseDto['user']['role'],
): string | null {
  if (role === null || role === undefined) return null;
  if (typeof role === 'number') {
    switch (role) {
      case -1:
        return 'Platform Admin';
      case 0:
        return 'Admin';
      case 1:
        return 'Student';
      case 2:
        return 'Teacher';
      default:
        return role.toString();
    }
  }
  return role ? role.toString() : null;
}

export function resolveUserRole(
  role: SettingsResponseDto['user']['role'],
): UserRole | null {
  if (role === null || role === undefined) return null;
  if (typeof role === 'number') {
    switch (role) {
      case UserRole.PlatformAdmin:
      case UserRole.Admin:
      case UserRole.Trainee:
      case UserRole.Instructor:
        return role;
      default:
        return null;
    }
  }
  const normalized = role.toString().toLowerCase();
  if (normalized.includes('platform')) return UserRole.PlatformAdmin;
  if (normalized.includes('student') || normalized.includes('trainee')) return UserRole.Trainee;
  if (normalized.includes('teacher') || normalized.includes('instructor')) return UserRole.Instructor;
  if (normalized.includes('admin')) return UserRole.Admin;
  return null;
}

function resolveToneColor(tone: ChipTone, theme: Theme) {
  switch (tone) {
    case 'primary':
    case 'secondary':
    case 'success':
    case 'info':
    case 'warning':
    case 'error':
      return theme.palette[tone].main;
    default:
      return theme.palette.text.primary;
  }
}

export function buildRoleTheme(roleKey: RoleKey, theme: Theme): RoleTheme {
  const chipColor: ChipTone =
    roleKey === 'default' ? 'default' : getRoleChipConfig(roleKey).color;
  const accent = resolveToneColor(chipColor, theme);
  const isDark = theme.palette.mode === 'dark';
  const gradientStart = alpha(accent, isDark ? 0.35 : 0.18);
  const gradientMid = alpha(accent, isDark ? 0.25 : 0.1);
  return {
    chipColor,
    accent,
    gradient: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientMid} 55%, ${theme.palette.background.paper} 100%)`,
    surface: alpha(accent, isDark ? 0.25 : 0.08),
    border: alpha(accent, isDark ? 0.5 : 0.2),
  };
}

export function formatMetricKey(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

export function formatMetricValue(key: string, value: number) {
  if (Number.isNaN(value)) return '—';
  const percentLike = /(percent|rate|ratio|grade|score)/i;
  if (percentLike.test(key)) {
    return `${value.toFixed(2)}%`;
  }
  if (Math.abs(value) >= 1000) {
    return COMPACT_METRIC_NUMBER.format(value);
  }
  return Number.isInteger(value) ? value.toString() : value.toFixed(2);
}

export function getChartPalette(accent: string, theme: Theme) {
  return [
    accent,
    theme.palette.text.secondary,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
  ];
}

export function getAccessModeMeta(mode: AccessMode): AccessModeMeta {
  return ACCESS_MODE_META_MAP[mode] ?? ACCESS_MODE_META_MAP.none;
}
