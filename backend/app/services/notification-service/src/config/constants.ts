export const SERVICE_NAME = 'notification-service' as const;

/**
 * Notification Service produces no domain events (per the Event Catalog
 * in arquitecture.md); it only consumes events and performs side effects
 * (Email/Push delivery).
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;
