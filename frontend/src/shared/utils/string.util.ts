/**
 * shared/utils/string.util.ts
 *
 * Generic string helpers used across shared/components and features
 * (e.g. `BaseAvatar` initials, `DataTable` truncation, filter chip
 * labels).
 */

export function truncate(value: string, maxLength: number, ellipsis = '…'): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - ellipsis.length))}${ellipsis}`;
}

/** Derives up to two uppercase initials from a display name, e.g. "Sarah Chen" -> "SC". */
export function getInitials(displayName: string | null | undefined): string {
  if (!displayName) return '?';

  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';

  const initials = parts
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('');

  return initials.toUpperCase();
}

export function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

/** Converts a SCREAMING_SNAKE_CASE backend enum value into "Title Case" display text. */
export function humanizeEnum(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map((word) => capitalize(word))
    .join(' ');
}

/** Deterministically slugifies a string, e.g. for generating anchor ids from category names. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/** Returns `true` when the string is empty or contains only whitespace. */
export function isBlank(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0;
}
