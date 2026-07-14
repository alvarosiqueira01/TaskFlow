export const SERVICE_NAME = 'collaboration-service' as const;

export const EVENT_SOURCE = 'collaboration-service' as const;

export const NOTIFICATION_TYPES = ['ASSIGNMENT', 'TASK_UPDATED', 'MENTION'] as const;

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
