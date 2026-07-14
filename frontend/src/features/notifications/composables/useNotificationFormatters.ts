const relativeTimeFormatter = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });

const RELATIVE_DIVISIONS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 60 * 60 * 24 * 365],
  ['month', 60 * 60 * 24 * 30],
  ['week', 60 * 60 * 24 * 7],
  ['day', 60 * 60 * 24],
  ['hour', 60 * 60],
  ['minute', 60],
];

/**
 * NOTE: intentionally duplicated from features/dashboard/composables —
 * cross-feature imports are disallowed by the Frontend Architecture
 * Standard. Promote to shared/utils if a canonical copy is ever added
 * there.
 */
export function useNotificationFormatters() {
  function formatRelativeTime(isoDate: string): string {
    const diffSeconds = Math.round((new Date(isoDate).getTime() - Date.now()) / 1000);

    for (const [unit, secondsInUnit] of RELATIVE_DIVISIONS) {
      if (Math.abs(diffSeconds) >= secondsInUnit) {
        return relativeTimeFormatter.format(Math.round(diffSeconds / secondsInUnit), unit);
      }
    }

    return relativeTimeFormatter.format(diffSeconds, 'second');
  }

  return { formatRelativeTime };
}
