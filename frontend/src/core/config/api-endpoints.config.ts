/**
 * core/config/api-endpoints.config.ts
 *
 * Single source of truth for every backend path exposed by the API.
 * Every entry here maps 1:1 to a `paths` entry in `swagger.yaml`.
 * Feature services (e.g. `TaskService`, `MediaService`) must import
 * these constants instead of hardcoding path strings.
 *
 * Do not add endpoints that are not defined in swagger.yaml.
 */

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PASSWORD_RECOVERY: '/auth/password/recovery',
    PASSWORD_RESET: '/auth/password/reset',
  },

  USERS: {
    ME: '/users/me',
    ME_PASSWORD: '/users/me/password',
    ROLES_BY_USER: (userId: string): string => `/users/${userId}/roles`,
  },

  TASKS: {
    COLLECTION: '/tasks',
    BY_ID: (taskId: string): string => `/tasks/${taskId}`,
    HISTORY: (taskId: string): string => `/tasks/${taskId}/history`,
  },

  ASSIGNMENTS: {
    BY_TASK: (taskId: string): string => `/tasks/${taskId}/assignments`,
    REMOVE: (taskId: string, userId: string): string =>
      `/tasks/${taskId}/assignments/${userId}`,
  },

  COLLABORATION: {
    COMMENTS_BY_TASK: (taskId: string): string => `/tasks/${taskId}/comments`,
  },

  NOTIFICATIONS: {
    COLLECTION: '/notifications',
    MARK_READ: (notificationId: string): string => `/notifications/${notificationId}/read`,
    MARK_ALL_READ: '/notifications/read-all',
  },

  MEDIA: {
    UPLOAD_URL: '/media/upload-url',
    COMPLETE: '/media/complete',
    MULTIPART_INITIATE: '/media/multipart',
    MULTIPART_PARTS: (mediaId: string): string => `/media/multipart/${mediaId}/parts`,
    MULTIPART_COMPLETE: (mediaId: string): string => `/media/multipart/${mediaId}/complete`,
    BY_ID: (mediaId: string): string => `/media/${mediaId}`,
    STREAM: (mediaId: string): string => `/media/${mediaId}/stream`,
  },

  CATEGORIES: {
    COLLECTION: '/categories',
  },

  REPORTS: {
    DASHBOARD: '/reports/dashboard',
    COMPLETED: '/reports/completed',
    PENDING: '/reports/pending',
  },

  ADMIN: {
    ROLES: '/roles',
    USER_ROLES: (userId: string): string => `/users/${userId}/roles`,
  },
} as const;
