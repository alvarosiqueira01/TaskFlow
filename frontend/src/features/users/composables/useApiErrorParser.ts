import { isAxiosError } from 'axios';
import type { FieldError } from '../types/user.types';

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
 * Normalizes an Axios error carrying an `application/problem+json` body
 * (per the 400/401/422 responses defined in the contract) into a simple
 * shape components can render.
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
