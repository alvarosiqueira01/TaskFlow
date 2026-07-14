import { BaseEvent } from '../base-event';
import { EventType } from '../event-types';

export interface TaskUpdatedPayload {
  taskId: string;
  changedFields: string[];
}

export class TaskUpdatedEvent extends BaseEvent<TaskUpdatedPayload> {
  constructor(payload: TaskUpdatedPayload, source: string, correlationId?: string) {
    super(EventType.TASK_UPDATED, source, payload, correlationId);
  }
}
