export const SERVICE_NAME = 'category-service' as const;

export const EVENT_SOURCE = 'category-service' as const;

export const CATEGORY_MANAGEMENT_ROLES = ['ADMINISTRATOR', 'PROJECT_MANAGER'] as const;

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
