import { BaseEvent } from '../base-event';
import { EventType } from '../event-types';

export interface TaskAssignedPayload {
  taskId: string;
  assigneeId: string;
  assignedBy: string;
}

export class TaskAssignedEvent extends BaseEvent<TaskAssignedPayload> {
  constructor(payload: TaskAssignedPayload, source: string, correlationId?: string) {
    super(EventType.TASK_ASSIGNED, source, payload, correlationId);
  }
}
