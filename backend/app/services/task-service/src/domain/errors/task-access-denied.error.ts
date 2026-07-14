import { DomainError } from './domain.error';

export class TaskAccessDeniedError extends DomainError {
  constructor(message = 'You do not have permission to perform this action on this task.') {
    super(message);
  }
}
