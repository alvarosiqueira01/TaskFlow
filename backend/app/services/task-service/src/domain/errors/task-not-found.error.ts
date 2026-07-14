import { DomainError } from './domain.error';

export class TaskNotFoundError extends DomainError {
  constructor(taskId: string) {
    super(`Task with id "${taskId}" was not found.`);
  }
}
