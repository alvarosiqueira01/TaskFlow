export interface CursorPaginatedResponse<T> {
  items: T[];
  limit: number;
  nextCursor: string | null;
  total?: number;
}
