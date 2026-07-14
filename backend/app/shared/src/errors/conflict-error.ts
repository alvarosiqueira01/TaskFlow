import { DomainError } from './domain-error';
import { ErrorCode } from './error-codes';

export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message, ErrorCode.CONFLICT);
    this.name = 'ConflictError';
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
