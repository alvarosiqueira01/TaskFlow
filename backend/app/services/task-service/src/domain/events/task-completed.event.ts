import { DomainEvent } from './domain-event';

export interface TaskCompletedPayload {
  taskId: string;
  ownerId: string;
  completedAt: string;
}

export class TaskCompletedEvent implements DomainEvent<TaskCompletedPayload> {
  readonly eventType = 'TaskCompleted';
  readonly eventVersion = '1.0';
  readonly source = 'task-service';
  readonly occurredAt: Date;

  constructor(readonly payload: TaskCompletedPayload) {
    this.occurredAt = new Date();
  }
}
