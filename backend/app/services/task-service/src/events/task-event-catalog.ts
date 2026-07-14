/**
 * Catalog of domain events published by task-service to Amazon EventBridge,
 * as defined in the Event Catalog section of the architecture proposal.
 */
export const TASK_EVENT_SOURCE = 'task-service';

export const TASK_EVENT_BUS_DETAIL_TYPES = {
  TASK_CREATED: 'TaskCreated',
  TASK_UPDATED: 'TaskUpdated',
  TASK_DELETED: 'TaskDeleted',
  TASK_COMPLETED: 'TaskCompleted',
} as const;

export type TaskEventDetailType =
  (typeof TASK_EVENT_BUS_DETAIL_TYPES)[keyof typeof TASK_EVENT_BUS_DETAIL_TYPES];

/**
 * Consumers registered downstream, kept here for documentation/versioning purposes.
 * Reporting Service consumes: TaskCreated, TaskUpdated, TaskCompleted.
 * Collaboration Service consumes: TaskCreated, TaskUpdated.
 */
export const TASK_EVENT_CONSUMERS: Record<TaskEventDetailType, string[]> = {
  TaskCreated: ['reporting-service', 'collaboration-service'],
  TaskUpdated: ['reporting-service', 'collaboration-service'],
  TaskDeleted: ['media-service'],
  TaskCompleted: ['reporting-service', 'notification-service'],
};
