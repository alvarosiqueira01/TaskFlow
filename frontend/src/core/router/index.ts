/**
 * core/router/index.ts
 *
 * Exposes CORE routing infrastructure only: navigation guards and the
 * `RouteMeta` type augmentation. The actual `Router` instance (route
 * table assembly, `createRouter`, `createWebHistory`) belongs to the
 * root `router/` directory, which imports these guards, e.g.:
 *
 *   import { createAuthGuard, createPermissionGuard } from '@/core/router';
 *   router.beforeEach(createAuthGuard());
 *   router.beforeEach(createPermissionGuard());
 */

export * from './guards';
export type {} from './types/route-meta.types';
import './types/route-meta.types';
