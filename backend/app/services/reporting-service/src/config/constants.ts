export const SERVICE_NAME = 'reporting-service' as const;

/**
 * Reporting Service produces no domain events (per the Event Catalog in
 * arquitecture.md); it only consumes events to build read projections.
 */
export const REPORT_PRIVILEGED_ROLES = ['ADMINISTRATOR', 'PROJECT_MANAGER'] as const;

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
