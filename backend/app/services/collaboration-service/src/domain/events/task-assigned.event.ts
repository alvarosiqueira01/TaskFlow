import { DomainEvent } from './event-publisher.port.js';

export interface TaskAssignedPayload {
  taskId: string;
  taskTitle: string;
  assignedUserId: string;
  assignedBy: string;
  assignedAt: string;
}

export class TaskAssignedEvent implements DomainEvent<TaskAssignedPayload> {
  eventName = 'TaskAssigned' as const;
  eventVersion = '1.0' as const;
  occurredAt: Date;
  payload: TaskAssignedPayload;

  constructor(payload: TaskAssignedPayload) {
    this.occurredAt = new Date();
    this.payload = payload;
  }
}
