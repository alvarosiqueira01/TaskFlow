import { ApplicationError } from './application-error';
import { ErrorCode } from './error-codes';

export interface ValidationIssue {
  field: string;
  message: string;
}

export class ValidationError extends ApplicationError {
  public readonly issues: ValidationIssue[];
  constructor(issues: ValidationIssue[], message = 'Validation failed') {
    super(message, ErrorCode.VALIDATION_ERROR);
    this.name = 'ValidationError';
    this.issues = issues;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
