import { DomainError } from './domain.error';

export class InvalidMediaDataError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
