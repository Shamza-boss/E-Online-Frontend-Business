/** South Africa Standard Time — no DST. */
export const SA_TIME_ZONE = 'Africa/Johannesburg';
export const SA_LOCALE = 'en-ZA';

export function toDate(value: string | Date | number): Date {
  return value instanceof Date ? value : new Date(value);
}

export function formatSaDate(
  value: string | Date | number | null | undefined,
  fallback = '—',
): string {
  if (value == null || value === '') return fallback;
  try {
    return new Intl.DateTimeFormat(SA_LOCALE, {
      timeZone: SA_TIME_ZONE,
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(toDate(value));
  } catch {
    return fallback;
  }
}

export function formatSaDateTime(
  value: string | Date | number | null | undefined,
  fallback = '—',
): string {
  if (value == null || value === '') return fallback;
  try {
    return new Intl.DateTimeFormat(SA_LOCALE, {
      timeZone: SA_TIME_ZONE,
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(toDate(value));
  } catch {
    return fallback;
  }
}

export function formatSaDateShort(
  value: string | Date | number | null | undefined,
  fallback = '—',
): string {
  if (value == null || value === '') return fallback;
  try {
    return new Intl.DateTimeFormat(SA_LOCALE, {
      timeZone: SA_TIME_ZONE,
      day: 'numeric',
      month: 'short',
    }).format(toDate(value));
  } catch {
    return fallback;
  }
}
