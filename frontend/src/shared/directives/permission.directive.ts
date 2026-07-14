/**
 * shared/directives/permission.directive.ts
 *
 * `v-permission="'MANAGE_CATEGORIES'"` or `v-permission="['MANAGE_USERS', 'VIEW_LOGS']"`
 * removes the bound element from the DOM when the current user does
 * not satisfy at least one of the given `PermissionKey`s (see
 * `core/constants/permissions.constants.ts`).
 *
 * This is a UI convenience only — it complements, and never replaces,
 * the route-level enforcement in `core/router/guards/permission.guard.ts`
 * and the backend's own RBAC (NFR-11).
 *
 * NOTE: reads the last-known user profile from `core/auth/token-storage`
 * at bind/update time. Once the `auth` feature's reactive Pinia store
 * exists, prefer a `usePermissions()` composable over this directive
 * for anything that must react live to role changes without a
 * re-render trigger.
 */

import type { Directive, DirectiveBinding } from 'vue';
import type { PermissionKey } from '../../core/constants/permissions.constants';
import { getStoredUser } from '../../core/auth/token-storage';
import { hasPermission } from '../../core/auth/permission-evaluator';

type PermissionBindingValue = PermissionKey | PermissionKey[];

function isAllowed(value: PermissionBindingValue): boolean {
  const currentUser = getStoredUser();
  const permissions = Array.isArray(value) ? value : [value];

  if (permissions.length === 0) return true;
  return permissions.some((permission) => hasPermission(currentUser, permission));
}

function applyVisibility(el: HTMLElement, binding: DirectiveBinding<PermissionBindingValue>): void {
  if (!isAllowed(binding.value)) {
    el.remove();
  }
}

export const vPermission: Directive<HTMLElement, PermissionBindingValue> = {
  mounted: applyVisibility,
  updated: applyVisibility,
};
