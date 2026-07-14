const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

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
 * Small, self-contained formatting helpers for the dashboard feature.
 * Kept local (rather than assumed to exist in shared/utils) so this
 * feature has no unverified cross-directory dependency.
 */
export function useDashboardFormatters() {
  function formatDueDate(isoDate: string | null): string {
    if (!isoDate) {
      return 'No due date';
    }
    return shortDateFormatter.format(new Date(isoDate));
  }

  function isOverdue(isoDate: string | null): boolean {
    if (!isoDate) {
      return false;
    }
    return new Date(isoDate).getTime() < Date.now();
  }

  function formatRelativeTime(isoDate: string): string {
    const diffSeconds = Math.round((new Date(isoDate).getTime() - Date.now()) / 1000);

    for (const [unit, secondsInUnit] of RELATIVE_DIVISIONS) {
      if (Math.abs(diffSeconds) >= secondsInUnit) {
        return relativeTimeFormatter.format(Math.round(diffSeconds / secondsInUnit), unit);
      }
    }

    return relativeTimeFormatter.format(Math.round(diffSeconds / 60) === 0 ? 0 : Math.round(diffSeconds), 'second');
  }

  return {
    formatDueDate,
    isOverdue,
    formatRelativeTime,
  };
}
