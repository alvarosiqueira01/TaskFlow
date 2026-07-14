export const PUBLISHED_EVENTS = {
  TASK_ASSIGNED: 'TaskAssigned',
  COMMENT_CREATED: 'CommentCreated',
  MENTION_CREATED: 'MentionCreated',
} as const;

export const CONSUMED_EVENTS = {
  TASK_CREATED: 'TaskCreated',
  TASK_UPDATED: 'TaskUpdated',
} as const;

export type PublishedEventName = (typeof PUBLISHED_EVENTS)[keyof typeof PUBLISHED_EVENTS];
export type ConsumedEventName = (typeof CONSUMED_EVENTS)[keyof typeof CONSUMED_EVENTS];
