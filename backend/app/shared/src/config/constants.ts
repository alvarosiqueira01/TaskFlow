export const HTTP_HEADERS = {
  CORRELATION_ID: 'x-correlation-id',
  REQUEST_ID: 'x-request-id',
  AUTHORIZATION: 'authorization',
} as const;

export const AUTH = {
  BEARER_PREFIX: 'Bearer ',
  DEFAULT_TOKEN_EXPIRATION: '1h',
} as const;

export const PAGINATION_DEFAULTS = {
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const EVENT_BUS = {
  SOURCE_PREFIX: 'task-manager',
} as const;
