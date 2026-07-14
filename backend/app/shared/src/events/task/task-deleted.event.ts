import { BaseEvent } from '../base-event';
import { EventType } from '../event-types';

export interface TaskDeletedPayload {
  taskId: string;
  deletedBy: string;
}

export class TaskDeletedEvent extends BaseEvent<TaskDeletedPayload> {
  constructor(payload: TaskDeletedPayload, source: string, correlationId?: string) {
    super(EventType.TASK_DELETED, source, payload, correlationId);
  }
}
