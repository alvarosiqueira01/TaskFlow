import { ApplicationError } from './application-error';
import { ErrorCode } from './error-codes';

export class ForbiddenError extends ApplicationError {
  constructor(message = 'You do not have permission to perform this action') {
    super(message, ErrorCode.FORBIDDEN);
    this.name = 'ForbiddenError';
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
