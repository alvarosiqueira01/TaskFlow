import { DomainError } from './domain-error';
import { ErrorCode } from './error-codes';

export class NotFoundError extends DomainError {
  constructor(resource: string, identifier?: string | number) {
    const message = identifier ? `${resource} with identifier '${identifier}' was not found` : `${resource} was not found`;
    super(message, ErrorCode.NOT_FOUND);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
