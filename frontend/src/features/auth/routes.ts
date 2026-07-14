/**
 * features/auth/routes.ts
 *
 * Route definitions for the auth feature. The root router (out of
 * scope for this execution) imports and spreads these into the full
 * route table. `meta.layout: 'auth'` is resolved by the root layout
 * switcher against the `AuthLayout` component generated in the
 * `layouts` scope — this file only declares metadata, it does not
 * import the layout component itself, keeping the feature decoupled
 * from layout wiring.
 *
 * All four routes are `guestOnly` + `requiresAuth: false`: enforced by
 * `core/router/guards/auth.guard.ts`, which redirects an already
 * authenticated user away from them.
 */

import type { RouteRecordRaw } from 'vue-router';
import { ROUTE_NAMES } from '../../core/constants/route-names.constants';

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: ROUTE_NAMES.LOGIN,
    component: () => import('./pages/LoginPage.vue'),
    meta: {
      requiresAuth: false,
      guestOnly: true,
      layout: 'auth',
      titleKey: 'auth.login.title',
    },
  },
  {
    path: '/register',
    name: ROUTE_NAMES.REGISTER,
    component: () => import('./pages/RegisterPage.vue'),
    meta: {
      requiresAuth: false,
      guestOnly: true,
      layout: 'auth',
      titleKey: 'auth.register.title',
    },
  },
  {
    path: '/forgot-password',
    name: ROUTE_NAMES.FORGOT_PASSWORD,
    component: () => import('./pages/ForgotPasswordPage.vue'),
    meta: {
      requiresAuth: false,
      guestOnly: true,
      layout: 'auth',
      titleKey: 'auth.forgotPassword.title',
    },
  },
  {
    path: '/reset-password',
    name: ROUTE_NAMES.RESET_PASSWORD,
    component: () => import('./pages/ResetPasswordPage.vue'),
    meta: {
      requiresAuth: false,
      guestOnly: true,
      layout: 'auth',
      titleKey: 'auth.resetPassword.title',
    },
  },
];

export default authRoutes;
