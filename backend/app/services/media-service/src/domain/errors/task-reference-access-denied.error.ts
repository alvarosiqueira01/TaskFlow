import { DomainError } from './domain.error';

/** Raised when task-service reports that the requester cannot access the referenced task. */
export class TaskReferenceAccessDeniedError extends DomainError {
  constructor(taskId: string) {
    super(`You do not have permission to attach or view media for task "${taskId}".`);
  }
}
