/**
 * features/auth/composables/useAuth.ts
 *
 * The primary entry point components/pages should use for anything
 * session-related — current user, auth actions, permission checks —
 * instead of importing `core/auth/token-storage` or
 * `core/auth/permission-evaluator` directly. Wraps `useAuthStore` with
 * `storeToRefs` so consumers get reactive refs without re-deriving
 * that boilerplate in every component.
 */

import { storeToRefs } from 'pinia';
import { useAuthStore } from '../store/auth.store';
import type { PermissionKey, RoleName } from '../../../core/constants/permissions.constants';

export function useAuth() {
  const store = useAuthStore();
  const { user, accessToken, isAuthenticated, isLoading, errorMessage, fieldErrors, isInitialized } =
    storeToRefs(store);

  function hasRole(roleName: RoleName | string): boolean {
    return store.userHasRole([roleName]);
  }

  function hasAnyRole(roleNames: ReadonlyArray<RoleName | string>): boolean {
    return store.userHasRole(roleNames);
  }

  function hasPermission(permission: PermissionKey): boolean {
    return store.userHasPermission(permission);
  }

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    errorMessage,
    fieldErrors,
    isInitialized,
    hasRole,
    hasAnyRole,
    hasPermission,
    login: store.login,
    register: store.register,
    requestPasswordRecovery: store.requestPasswordRecovery,
    resetPassword: store.resetPassword,
    fetchCurrentUser: store.fetchCurrentUser,
    initialize: store.initialize,
    logout: store.logout,
  };
}
