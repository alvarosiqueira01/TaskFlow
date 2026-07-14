import { BaseEvent } from '../base-event';
import { EventType } from '../event-types';

export interface TaskCompletedPayload {
  taskId: string;
  completedBy: string;
  completedAt: string;
}

export class TaskCompletedEvent extends BaseEvent<TaskCompletedPayload> {
  constructor(payload: TaskCompletedPayload, source: string, correlationId?: string) {
    super(EventType.TASK_COMPLETED, source, payload, correlationId);
  }
}
