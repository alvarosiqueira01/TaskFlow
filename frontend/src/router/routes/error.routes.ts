/**
 * router/routes/error.routes.ts
 *
 * Fallback routes that don't belong to any business feature. All three
 * are reachable regardless of auth state (`requiresAuth: false`) and
 * render inside the chrome-light `DefaultLayout`. The catch-all must
 * stay LAST in the assembled route table (see `router/index.ts`) so
 * every feature route gets a chance to match first.
 */

import type { RouteRecordRaw } from 'vue-router';
import { ROUTE_NAMES } from '../../core/constants/route-names.constants';

export const errorRoutes: RouteRecordRaw[] = [
  {
    path: '/403',
    name: ROUTE_NAMES.FORBIDDEN,
    component: () => import('../views/ForbiddenView.vue'),
    meta: {
      requiresAuth: false,
      layout: 'default',
      titleKey: 'core.errors.forbidden',
    },
  },
  {
    path: '/500',
    name: ROUTE_NAMES.SERVER_ERROR,
    component: () => import('../views/ServerErrorView.vue'),
    meta: {
      requiresAuth: false,
      layout: 'default',
      titleKey: 'core.errors.serverError',
    },
  },
  {
    // Catch-all — must stay last so every route above gets a chance to match first.
    path: '/:pathMatch(.*)*',
    name: ROUTE_NAMES.NOT_FOUND,
    component: () => import('../views/NotFoundView.vue'),
    meta: {
      requiresAuth: false,
      layout: 'default',
      titleKey: 'core.errors.notFound',
    },
  },
];

export default errorRoutes;