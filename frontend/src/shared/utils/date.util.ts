/**
 * shared/utils/date.util.ts
 *
 * Date/time formatting helpers. All backend timestamps arrive as ISO
 * 8601 strings (`format: date-time` throughout swagger.yaml); these
 * utilities are the single place that converts them into
 * human-readable text, per `UI-UX-guidelines.md` (human-readable,
 * non-technical output).
 */

const DEFAULT_LOCALE = 'en-US';

export function formatDate(isoDate: string | null | undefined, locale = DEFAULT_LOCALE): string {
  if (!isoDate) return '—';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatDateTime(isoDate: string | null | undefined, locale = DEFAULT_LOCALE): string {
  if (!isoDate) return '—';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/** Renders "2 hours ago" / "in 3 days" style relative timestamps, e.g. for comments and activity feeds. */
export function formatRelativeTime(isoDate: string | null | undefined, locale = DEFAULT_LOCALE): string {
  if (!isoDate) return '—';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '—';

  const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const absSeconds = Math.abs(diffSeconds);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  const thresholds: Array<[number, Intl.RelativeTimeFormatUnit]> = [
    [60, 'second'],
    [3600, 'minute'],
    [86_400, 'hour'],
    [604_800, 'day'],
    [2_629_800, 'week'],
    [31_557_600, 'month'],
    [Infinity, 'year'],
  ];

  const divisors: Record<Intl.RelativeTimeFormatUnit, number> = {
    second: 1,
    minute: 60,
    hour: 3600,
    day: 86_400,
    week: 604_800,
    month: 2_629_800,
    year: 31_557_600,
    quarter: 7_889_400,
    seconds: 1,
    minutes: 60,
    hours: 3600,
    days: 86_400,
    weeks: 604_800,
    months: 2_629_800,
    years: 31_557_600,
    quarters: 7_889_400,
  };

  const [, unit] = thresholds.find(([limit]) => absSeconds < limit) ?? [Infinity, 'year'];
  const value = Math.round(diffSeconds / divisors[unit]);

  return rtf.format(value, unit);
}

/** Formats a media duration in seconds as `mm:ss` (or `h:mm:ss` for videos over an hour). */
export function formatDuration(totalSeconds: number | null | undefined): string {
  if (totalSeconds == null || Number.isNaN(totalSeconds) || totalSeconds < 0) return '--:--';

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const pad = (value: number): string => value.toString().padStart(2, '0');

  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
}

/** Returns `true` when the given ISO date is strictly before now (used for overdue task indicators). */
export function isPastDue(isoDate: string | null | undefined): boolean {
  if (!isoDate) return false;
  const date = new Date(isoDate);
  return !Number.isNaN(date.getTime()) && date.getTime() < Date.now();
}
