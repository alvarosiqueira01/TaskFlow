import { BaseEvent } from '../base-event';
import { EventType } from '../event-types';
import type { TaskPriority } from '../../contracts/enums/task-priority.enum';
import type { TaskStatus } from '../../contracts/enums/task-status.enum';
import type { TaskVisibility } from '../../contracts/enums/task-visibility.enum';

export interface TaskCreatedPayload {
  taskId: string;
  title: string;
  ownerId: string;
  categoryId?: string;
  priority: TaskPriority;
  status: TaskStatus;
  visibility: TaskVisibility;
  archived: boolean;
  dueDate?: string;
}

export class TaskCreatedEvent extends BaseEvent<TaskCreatedPayload> {
  constructor(payload: TaskCreatedPayload, source: string, correlationId?: string) {
    super(EventType.TASK_CREATED, source, payload, correlationId);
  }
}
