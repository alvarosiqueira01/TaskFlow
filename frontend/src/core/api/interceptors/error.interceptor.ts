/**
 * core/api/interceptors/error.interceptor.ts
 *
 * Response interceptor that:
 *   1. Normalizes every failed response into the `ApiError` shape,
 *      unwrapping the `application/problem+json` (`ProblemDetails`)
 *      body used consistently across swagger.yaml error responses.
 *   2. Reacts to `401 Unauthorized` by clearing the local session so
 *      the next navigation is caught by `auth.guard.ts`.
 *   3. Extracts `RateLimitHeaders` (`X-RateLimit-*`, `Retry-After`) for
 *      callers that want to react to throttling.
 */

import type { AxiosError, AxiosResponse } from 'axios';
import { HTTP_STATUS } from '../../constants/http-status.constants';
import { clearSession } from '../../auth/token-storage';
import type { ApiError, ProblemDetails, RateLimitInfo } from '../types/api.types';

export function extractRateLimitInfo(response: AxiosResponse | undefined): RateLimitInfo {
  const headers = response?.headers ?? {};
  const parseIntOrNull = (value: unknown): number | null => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  return {
    limit: parseIntOrNull(headers['x-ratelimit-limit']),
    remaining: parseIntOrNull(headers['x-ratelimit-remaining']),
    retryAfterSeconds: parseIntOrNull(headers['retry-after']),
  };
}

function toApiError(error: AxiosError<ProblemDetails>): ApiError {
  const response = error.response;

  if (!response) {
    return {
      status: 0,
      title: error.code === 'ECONNABORTED' ? 'Request Timeout' : 'Network Error',
      detail: error.message,
      isNetworkError: true,
    };
  }

  const problem = response.data;

  return {
    status: response.status,
    title: problem?.title ?? 'Unexpected Error',
    detail: problem?.detail,
    fieldErrors: problem?.errors,
    isNetworkError: false,
  };
}

/**
 * Success-path passthrough, kept symmetrical with `handleResponseError`
 * so both can be registered as a single `axiosInstance.interceptors.response.use(...)` pair.
 */
export function handleResponseSuccess(response: AxiosResponse): AxiosResponse {
  return response;
}

export async function handleResponseError(error: AxiosError<ProblemDetails>): Promise<never> {
  const apiError = toApiError(error);

  if (apiError.status === HTTP_STATUS.UNAUTHORIZED) {
    clearSession();
  }

  return Promise.reject(apiError);
}
