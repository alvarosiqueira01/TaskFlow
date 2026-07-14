import { DomainEvent } from './domain-event';

export interface TaskDeletedPayload {
  taskId: string;
  ownerId: string;
  deletedBy: string;
}

export class TaskDeletedEvent implements DomainEvent<TaskDeletedPayload> {
  readonly eventType = 'TaskDeleted';
  readonly eventVersion = '1.0';
  readonly source = 'task-service';
  readonly occurredAt: Date;

  constructor(readonly payload: TaskDeletedPayload) {
    this.occurredAt = new Date();
  }
}
