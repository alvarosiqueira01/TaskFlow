import { DomainError } from './domain.error';

export class InvalidTaskDataError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
