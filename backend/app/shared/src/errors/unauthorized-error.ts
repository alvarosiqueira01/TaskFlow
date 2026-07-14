import { ApplicationError } from './application-error';
import { ErrorCode } from './error-codes';

export class UnauthorizedError extends ApplicationError {
  constructor(message = 'Authentication is required to access this resource') {
    super(message, ErrorCode.UNAUTHORIZED);
    this.name = 'UnauthorizedError';
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
