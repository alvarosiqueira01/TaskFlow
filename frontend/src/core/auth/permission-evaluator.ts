/**
 * core/auth/permission-evaluator.ts
 *
 * Pure functions to evaluate whether a given user satisfies a role or
 * a frontend permission identifier. Used by:
 *   - `core/router/guards/permission.guard.ts`
 *   - the future `v-permission` directive / `usePermissions` composable
 *     under `shared/`.
 *
 * Kept framework-agnostic (no Vue/Pinia imports) so it is trivially
 * unit-testable per `testing-strategy.md`.
 */

import { PERMISSIONS, type PermissionKey, type RoleName } from '../constants/permissions.constants';
import type { User } from './types/auth.types';

export function hasRole(user: User | null | undefined, roleName: RoleName | string): boolean {
  if (!user?.roles?.length) return false;
  return user.roles.some((role) => role.name === roleName);
}

export function hasAnyRole(
  user: User | null | undefined,
  roleNames: ReadonlyArray<RoleName | string>,
): boolean {
  if (!user?.roles?.length || roleNames.length === 0) return false;
  const userRoleNames = new Set(user.roles.map((role) => role.name));
  return roleNames.some((roleName) => userRoleNames.has(roleName));
}

/**
 * Resolves whether `user` is allowed to perform `permission`, based on
 * the role-to-permission mapping declared in `PERMISSIONS`.
 */
export function hasPermission(user: User | null | undefined, permission: PermissionKey): boolean {
  const allowedRoles = PERMISSIONS[permission];
  return hasAnyRole(user, allowedRoles);
}

/**
 * Resolves whether `user` satisfies ALL permissions in `permissions`.
 * Useful for routes/actions that require a combination of capabilities.
 */
export function hasAllPermissions(
  user: User | null | undefined,
  permissions: ReadonlyArray<PermissionKey>,
): boolean {
  return permissions.every((permission) => hasPermission(user, permission));
}
