import { ErrorCode } from './error-codes';

export class DomainError extends Error {
  public readonly code: ErrorCode;
  constructor(message: string, code: ErrorCode = ErrorCode.DOMAIN_RULE_VIOLATION) {
    super(message);
    this.name = 'DomainError';
    this.code = code;
    Object.setPrototypeOf(this, DomainError.prototype);
  }
}
