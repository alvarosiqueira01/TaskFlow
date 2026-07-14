export interface CursorPaginatedResponseDto<T> {
  limit: number;
  nextCursor: string | null;
  total?: number;
  items: T[];
}
