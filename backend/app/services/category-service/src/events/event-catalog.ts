export const PUBLISHED_EVENTS = {
  CATEGORY_CREATED: 'CategoryCreated',
} as const;

/**
 * Per the Event Catalog in arquitecture.md, category-service does not
 * consume any domain events. This map is intentionally empty and kept
 * for consistency with the standard service layout.
 */
export const CONSUMED_EVENTS = {} as const;

export type PublishedEventName = (typeof PUBLISHED_EVENTS)[keyof typeof PUBLISHED_EVENTS];
