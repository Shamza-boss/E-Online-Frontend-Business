import { routeLabels } from '@/app/_lib/common/functions';

export const BREADCRUMB_ARIA_LABEL = 'breadcrumb';

export function formatBreadcrumbLabel(part: string): string {
  if (routeLabels[part]) {
    return routeLabels[part];
  }

  if (part.includes('~')) {
    const namePart = decodeURIComponent(part).split('~')[0];
    if (!namePart) {
      return part;
    }
    return namePart.replace(/-/g, ' ');
  }

  return part
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
}

export function getBreadcrumbHref(pathParts: string[], index: number): string {
  return `/${pathParts.slice(0, index + 1).join('/')}`;
}
