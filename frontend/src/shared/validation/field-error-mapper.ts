/**
 * shared/validation/field-error-mapper.ts
 *
 * Normalizes both client-side Zod validation failures and server-side
 * `ProblemDetails.errors` (422 Unprocessable Entity responses, per
 * swagger.yaml) into the same `Record<field, message>` shape, so
 * `FormField` / `ValidationMessage` never need to know which side
 * produced the error.
 */

import type { ZodError } from 'zod';
import type { ApiError } from '../../core/api/types/api.types';

export type FieldErrorMap = Record<string, string>;

export function mapZodErrorToFieldErrors(error: ZodError): FieldErrorMap {
  const fieldErrors: FieldErrorMap = {};

  for (const issue of error.issues) {
    const field = issue.path.join('.') || '_root';
    if (!fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }

  return fieldErrors;
}

/**
 * Extracts field errors from a normalized `ApiError` (see
 * `core/api/interceptors/error.interceptor.ts`), typically produced by
 * a 422 response. Falls back to an empty map when the backend did not
 * return field-level detail.
 */
export function mapApiErrorToFieldErrors(error: ApiError): FieldErrorMap {
  const fieldErrors: FieldErrorMap = {};

  for (const entry of error.fieldErrors ?? []) {
    if (entry.field && entry.message && !fieldErrors[entry.field]) {
      fieldErrors[entry.field] = entry.message;
    }
  }

  return fieldErrors;
}

export function hasFieldError(fieldErrors: FieldErrorMap, field: string): boolean {
  return Boolean(fieldErrors[field]);
}
