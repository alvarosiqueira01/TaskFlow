/**
 * shared/types/pagination.types.ts
 *
 * UI-facing pagination models. Distinct from
 * `core/api/types/api.types.ts#CursorPaginatedResponse`, which mirrors
 * the wire format returned by the backend: these types describe local
 * component/table state and are used by `usePagination` and `DataTable`.
 */

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface CursorPaginationState {
  cursor: string | null;
  limit: number;
  hasMore: boolean;
}

export interface CursorPaginationResponse<T> {
  items: T[];
  nextCursor: string | null;
  limit: number;
  total?: number;
}

export interface PaginationChangeEvent {
  page: number;
  pageSize: number;
}
