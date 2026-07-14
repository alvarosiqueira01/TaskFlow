import { DomainEvent } from './domain-event';

export interface TaskCreatedPayload {
  taskId: string;
  ownerId: string;
  title: string;
  status: string;
  priority: string;
  categoryId?: string;
}

export class TaskCreatedEvent implements DomainEvent<TaskCreatedPayload> {
  readonly eventType = 'TaskCreated';
  readonly eventVersion = '1.0';
  readonly source = 'task-service';
  readonly occurredAt: Date;

  constructor(readonly payload: TaskCreatedPayload) {
    this.occurredAt = new Date();
  }
}
