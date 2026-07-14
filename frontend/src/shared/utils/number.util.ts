/**
 * shared/utils/number.util.ts
 *
 * Number/byte-size formatting helpers. Byte formatting in particular is
 * shared by any future media upload UI (`fileSize: integer format:
 * int64` fields throughout swagger.yaml's Media schemas).
 */

const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

export function formatBytes(bytes: number | null | undefined, precision = 1): string {
  if (bytes == null || Number.isNaN(bytes) || bytes < 0) return '—';
  if (bytes === 0) return '0 B';

  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    BYTE_UNITS.length - 1,
  );
  const value = bytes / 1024 ** exponent;

  return `${value.toFixed(exponent === 0 ? 0 : precision)} ${BYTE_UNITS[exponent]}`;
}

export function formatPercentage(value: number | null | undefined, precision = 0): string {
  if (value == null || Number.isNaN(value)) return '—';
  return `${value.toFixed(precision)}%`;
}

export function formatCompactNumber(value: number | null | undefined, locale = 'en-US'): string {
  if (value == null || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat(locale, { notation: 'compact' }).format(value);
}

/** Clamps `value` between `min` and `max` — used by progress bars and pagination controls. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
