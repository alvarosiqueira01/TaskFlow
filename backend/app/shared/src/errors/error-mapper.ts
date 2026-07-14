import { ApplicationError } from './application-error';
import { ConflictError } from './conflict-error';
import { DomainError } from './domain-error';
import { ErrorCode } from './error-codes';
import { ForbiddenError } from './forbidden-error';
import { HttpError } from './http-error';
import { NotFoundError } from './not-found-error';
import { UnauthorizedError } from './unauthorized-error';
import { ValidationError } from './validation-error';

export function mapErrorToHttp(error: unknown): HttpError {
  if (error instanceof HttpError) return error;
  if (error instanceof ValidationError) return new HttpError(422, ErrorCode.VALIDATION_ERROR, error.message, error.issues);
  if (error instanceof NotFoundError) return new HttpError(404, ErrorCode.NOT_FOUND, error.message);
  if (error instanceof UnauthorizedError) return new HttpError(401, ErrorCode.UNAUTHORIZED, error.message);
  if (error instanceof ForbiddenError) return new HttpError(403, ErrorCode.FORBIDDEN, error.message);
  if (error instanceof ConflictError) return new HttpError(409, ErrorCode.CONFLICT, error.message);
  if (error instanceof DomainError) return new HttpError(422, error.code, error.message);
  if (error instanceof ApplicationError) return new HttpError(400, error.code, error.message);
  if (error instanceof Error) return new HttpError(500, ErrorCode.INTERNAL_SERVER_ERROR, 'An unexpected error occurred', { originalMessage: error.message });
  
  return new HttpError(500, ErrorCode.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');
}
