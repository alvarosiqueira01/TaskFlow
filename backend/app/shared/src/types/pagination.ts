export interface CursorPaginated<T> {
  items: T[];
  limit: number;
  nextCursor: string | null;
  total?: number;
}
