/**
 * router/routes/home.routes.ts
 *
 * The `dashboard` feature now exists (`features/dashboard/routes.ts`
 * registers the real `DashboardPage.vue` at `/dashboard`), so `home`
 * no longer needs a placeholder view of its own — per the removal
 * note this file used to carry ("remove `homeRoutes` once a real
 * dashboard exists") and the matching note in
 * `router/views/HomeView.vue` ("replace `component` on the `home`
 * route ... and delete this file"). `HomeView.vue` has been deleted.
 *
 * `ROUTE_NAMES.HOME` is still relied on by core infrastructure that
 * predates the dashboard feature and isn't in scope to change here:
 *  - `core/router/guards/auth.guard.ts` sends an already-authenticated
 *    user hitting a `guestOnly` route (e.g. `/login`) to `{ name: HOME }`.
 *  - `layouts/AdminLayout.vue`'s `exitAdminArea()` and
 *    `layouts/DashboardLayout.vue`'s sidebar brand link both navigate
 *    to `{ name: HOME }`.
 *  - `router/views/ForbiddenView.vue` / `NotFoundView.vue` likely offer
 *    a "back to home" action against the same name (see those files).
 *
 * None of those call sites know (or should need to know) the
 * dashboard feature's own route name/path. So `home` stays a real,
 * named route at `/` — it just redirects straight to `/dashboard`
 * instead of rendering anything itself. A path-based redirect (rather
 * than `redirect: { name: 'dashboard' }`) is used deliberately so this
 * file doesn't depend on the literal route name string the `dashboard`
 * feature happens to have chosen internally.
 */

import type { RouteRecordRaw } from 'vue-router';
import { ROUTE_NAMES } from '../../core/constants/route-names.constants';

export const homeRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: ROUTE_NAMES.HOME,
    redirect: '/dashboard',
  },
];

export default homeRoutes;