/**
 * router/index.ts
 *
 * The application's root routing configuration, per
 * `frontend-architecture-standard.md`: assembles every feature's
 * `routes.ts` into one route table, registers the global navigation
 * guards from `core/router/guards`, and creates the `Router` instance.
 * No business logic lives here.
 *
 * All ten features now exist and each contributes its own
 * `routes.ts`. `collaboration` and `media` are the two exceptions
 * called out in `frontend-architecture-standard.md`'s per-feature
 * structure ("not every feature is required to include all
 * directories") — both are task-scoped (comments/attachments render
 * inside `features/tasks/pages/TaskDetailsPage.vue`) and don't own any
 * routes of their own, so there is no `routes.ts` to import from
 * either.
 *
 * `homeRoutes` (see `router/routes/home.routes.ts`) is kept, but only
 * as a redirect shim from `/` to `/dashboard` now that a real
 * `dashboard` feature exists — see that file's doc comment.
 *
 * Route table order matters:
 *  - `homeRoutes` is listed first so `/` resolves predictably rather
 *    than depending on where a feature happens to be spread in below.
 *  - The catch-all `/:pathMatch(.*)*` inside `errorRoutes` must be
 *    LAST so every other route is matched first.
 *  - The relative order of the remaining feature route arrays doesn't
 *    otherwise affect matching, since none of their static paths
 *    collide; they're listed alphabetically by feature for
 *    readability.
 */

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { createAuthGuard, createPermissionGuard } from '../core/router/guards';
import { authRoutes } from '../features/auth/routes';
import categoriesRoutes from '../features/categories/routes';
import dashboardRoutes from '../features/dashboard/routes';
import notificationRoutes from '../features/notifications/routes';
import reportsRoutes from '../features/reports/routes';
import settingsRoutes from '../features/settings/routes';
import tasksRoutes from '../features/tasks/routes';
import userRoutes from '../features/users/routes';
import { homeRoutes } from './routes/home.routes';
import { errorRoutes } from './routes/error.routes';

const routes: RouteRecordRaw[] = [
  ...homeRoutes,
  ...authRoutes,
  ...categoriesRoutes,
  ...dashboardRoutes,
  ...notificationRoutes,
  ...reportsRoutes,
  ...settingsRoutes,
  ...tasksRoutes,
  ...userRoutes,
  // `collaboration` and `media` intentionally contribute no routes —
  // see the doc comment above.
  ...errorRoutes,
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 };
  },
});

router.beforeEach(createAuthGuard());
router.beforeEach(createPermissionGuard());

export default router;