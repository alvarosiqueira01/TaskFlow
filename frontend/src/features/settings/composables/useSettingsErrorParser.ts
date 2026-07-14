import { isAxiosError } from 'axios';
import type { FieldError } from '../types/settings.types';

interface ParsedApiError {
  title: string | null;
  fieldErrors: FieldError[];
}

/** Mirrors components.schemas.ProblemDetails (RFC 9457). */
interface ProblemDetailsDto {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  errors?: FieldError[];
}

/**
 * NOTE: intentionally duplicated from features/users/composables —
 * cross-feature imports are disallowed by the Frontend Architecture
 * Standard. Promote to shared/utils if a canonical copy is ever added
 * there, and have both features consume it from shared instead.
 */
export function parseProblemDetails(error: unknown): ParsedApiError {
  if (isAxiosError<ProblemDetailsDto>(error) && error.response?.data) {
    const problem = error.response.data;
    return {
      title: problem.detail ?? problem.title ?? null,
      fieldErrors: problem.errors ?? [],
    };
  }

  return { title: null, fieldErrors: [] };
}
