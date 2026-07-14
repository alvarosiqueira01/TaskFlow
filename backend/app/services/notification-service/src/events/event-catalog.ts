/**
 * Notification Service produces no domain events — it is a pure event
 * consumer with side effects (Email/Push delivery), per arquitecture.md
 * §3.7 and the Event Catalog §9. This map is intentionally empty and kept
 * for consistency with the standard service layout; no `events/published/`
 * directory is generated.
 */
export const PUBLISHED_EVENTS = {} as const;

export const CONSUMED_EVENTS = {
  TASK_ASSIGNED: 'TaskAssigned',
  MENTION_CREATED: 'MentionCreated',
  TASK_COMPLETED: 'TaskCompleted',
} as const;

export type ConsumedEventName = (typeof CONSUMED_EVENTS)[keyof typeof CONSUMED_EVENTS];
