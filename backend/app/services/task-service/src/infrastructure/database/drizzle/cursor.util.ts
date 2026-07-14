import { TaskSortField } from '../../../domain/repositories/task.repository';

export interface DecodedCursor {
  value: string;
  id: string;
}

export function encodeCursor(rawValue: string, id: string): string {
  return Buffer.from(JSON.stringify({ value: rawValue, id })).toString('base64url');
}

export function decodeCursor(cursor: string): DecodedCursor {
  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf-8'));
  } catch {
    throw new Error('Invalid pagination cursor.');
  }

  const candidate = parsed as Partial<DecodedCursor>;
  if (typeof candidate.value !== 'string' || typeof candidate.id !== 'string') {
    throw new Error('Invalid pagination cursor.');
  }

  return { value: candidate.value, id: candidate.id };
}

const DATE_SORT_FIELDS: TaskSortField[] = ['createdAt', 'updatedAt', 'dueDate'];

export function isDateSortField(field: TaskSortField): boolean {
  return DATE_SORT_FIELDS.includes(field);
}

export function cursorValueToComparable(field: TaskSortField, value: string): string | Date {
  return isDateSortField(field) ? new Date(value) : value;
}
