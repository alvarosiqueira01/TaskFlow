/**
 * Reporting Service produces no domain events — it is a pure read-model
 * consumer (per arquitecture.md §3.6 and the Event Catalog §9). This map
 * is intentionally empty and kept for consistency with the standard
 * service layout; no `events/published/` directory is generated.
 */
export const PUBLISHED_EVENTS = {} as const;

export const CONSUMED_EVENTS = {
  TASK_CREATED: 'TaskCreated',
  TASK_UPDATED: 'TaskUpdated',
  TASK_COMPLETED: 'TaskCompleted',
  CATEGORY_CREATED: 'CategoryCreated',
  COMMENT_CREATED: 'CommentCreated',
  MEDIA_UPLOADED: 'MediaUploaded',
  MEDIA_DELETED: 'MediaDeleted',
} as const;

export type ConsumedEventName = (typeof CONSUMED_EVENTS)[keyof typeof CONSUMED_EVENTS];
