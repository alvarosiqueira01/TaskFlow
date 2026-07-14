import { DomainEvent } from './domain-event';
import { TaskFieldChange } from '../entities/task.entity';

export interface TaskUpdatedPayload {
  taskId: string;
  ownerId: string;
  updatedBy: string;
  changes: TaskFieldChange[];
}

export class TaskUpdatedEvent implements DomainEvent<TaskUpdatedPayload> {
  readonly eventType = 'TaskUpdated';
  readonly eventVersion = '1.0';
  readonly source = 'task-service';
  readonly occurredAt: Date;

  constructor(readonly payload: TaskUpdatedPayload) {
    this.occurredAt = new Date();
  }
}
