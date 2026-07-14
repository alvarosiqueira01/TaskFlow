export interface CursorPaginatedResponse<T> {
  limit: number;
  nextCursor: string | null;
  total?: number;
  items: T[];
}
