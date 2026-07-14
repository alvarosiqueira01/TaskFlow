import { DomainError } from './domain.error';

/** Raised when task-service reports that the referenced task does not exist. */
export class TaskReferenceNotFoundError extends DomainError {
  constructor(taskId: string) {
    super(`Referenced task "${taskId}" was not found.`);
  }
}
