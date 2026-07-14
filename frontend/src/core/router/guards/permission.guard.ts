/**
 * core/router/guards/permission.guard.ts
 *
 * Global navigation guard enforcing `meta.roles` / `meta.permissions`.
 * Must run AFTER `auth.guard.ts` (the root router registers both, in
 * order) since it assumes a user profile may already be present in
 * local storage.
 */

import type { NavigationGuardWithThis, RouteLocationNormalized } from 'vue-router';
import { ROUTE_NAMES } from '../../constants/route-names.constants';
import { getStoredUser } from '../../auth/token-storage';
import { hasAnyRole, hasPermission } from '../../auth/permission-evaluator';

export function createPermissionGuard(): NavigationGuardWithThis<undefined> {
  return (to: RouteLocationNormalized) => {
    const requiredRoles = to.meta.roles;
    const requiredPermissions = to.meta.permissions;

    if (!requiredRoles?.length && !requiredPermissions?.length) {
      return true;
    }

    const currentUser = getStoredUser();

    const satisfiesRoles = requiredRoles?.length ? hasAnyRole(currentUser, requiredRoles) : true;

    const satisfiesPermissions = requiredPermissions?.length
      ? requiredPermissions.some((permission) => hasPermission(currentUser, permission))
      : true;

    if (satisfiesRoles && satisfiesPermissions) {
      return true;
    }

    return { name: ROUTE_NAMES.FORBIDDEN };
  };
}
