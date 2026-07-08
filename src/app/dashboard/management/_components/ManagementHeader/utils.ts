import {
  TAB_COURSES,
  TAB_USERS,
  SEARCH_PLACEHOLDER_COURSES,
  SEARCH_PLACEHOLDER_USERS,
  NO_PERMISSION_TOOLTIP,
} from './constants';

export function getSearchPlaceholder(activeTab: string): string {
  return activeTab === TAB_USERS
    ? SEARCH_PLACEHOLDER_USERS
    : SEARCH_PLACEHOLDER_COURSES;
}

export function getNoPermissionTooltip(isElevated: boolean): string {
  return isElevated ? '' : NO_PERMISSION_TOOLTIP;
}
