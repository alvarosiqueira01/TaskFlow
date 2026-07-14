/**
 * core/constants/route-names.constants.ts
 *
 * Named routes referenced by core infrastructure (guards, layouts,
 * interceptors) for programmatic navigation (`router.push({ name })`).
 * Using names instead of hardcoded paths keeps navigation resilient to
 * path changes made inside feature `routes.ts` files.
 *
 * This file only declares the route names that CORE depends on.
 * Each feature's `routes.ts` is responsible for actually registering
 * a route under these names where noted, plus any additional
 * feature-specific route names.
 */
export const ROUTE_NAMES = {
  /** Public landing / default route, provided by a future `dashboard` or `home` feature */
  HOME: 'home',

  /** Authentication feature routes */
  LOGIN: 'auth.login',
  REGISTER: 'auth.register',
  FORGOT_PASSWORD: 'auth.forgot-password',
  RESET_PASSWORD: 'auth.reset-password',

  /** Error / fallback routes, resolved by the root router configuration */
  FORBIDDEN: 'error.forbidden',
  NOT_FOUND: 'error.not-found',
  SERVER_ERROR: 'error.server-error',

  /** Administration area */
  ADMIN_DASHBOARD: 'admin.dashboard',
} as const;

export type RouteName = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES];
