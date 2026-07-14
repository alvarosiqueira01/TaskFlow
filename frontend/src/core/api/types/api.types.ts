/**
 * core/api/types/api.types.ts
 *
 * Wire-level contracts that are the same for every endpoint in
 * swagger.yaml, regardless of domain (`ProblemDetails`,
 * `CursorPaginatedResponse`, rate-limit headers). Domain-specific
 * DTOs (Task, Category, MediaAttachment, ...) belong to their
 * respective feature's `types/` folder once that feature is generated.
 */

/** RFC 9457 Problem Details, returned by every documented error response. */
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: Array<{ field?: string; message?: string }>;
}

/** Generic cursor-paginated envelope (`CursorPaginatedResponse` + `items`). */
export interface CursorPaginatedResponse<TItem> {
  limit: number;
  nextCursor: string | null;
  total?: number;
  items: TItem[];
}

/** Parsed values of the `RateLimitHeaders` response headers component. */
export interface RateLimitInfo {
  limit: number | null;
  remaining: number | null;
  retryAfterSeconds: number | null;
}

/** Normalized error shape produced by the response error interceptor. */
export interface ApiError {
  status: number;
  title: string;
  detail?: string;
  fieldErrors?: Array<{ field?: string; message?: string }>;
  /** `true` when the request failed before reaching the server (network/timeout). */
  isNetworkError: boolean;
}
