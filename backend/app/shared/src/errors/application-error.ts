import { ErrorCode } from './error-codes';

export class ApplicationError extends Error {
  public readonly code: ErrorCode;
  constructor(message: string, code: ErrorCode = ErrorCode.BAD_REQUEST) {
    super(message);
    this.name = 'ApplicationError';
    this.code = code;
    Object.setPrototypeOf(this, ApplicationError.prototype);
  }
}
