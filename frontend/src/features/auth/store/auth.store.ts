/**
 * features/auth/store/auth.store.ts
 *
 * The reactive `authStore` called for in `UI-UX-guidelines.md`
 * section 30. This supersedes the placeholder pattern used in
 * `layouts/DashboardLayout.vue`, `layouts/AdminLayout.vue`, and
 * `shared/directives/permission.directive.ts` (all of which read
 * `core/auth/token-storage` directly with a documented "read again
 * once the auth store exists" TODO). Those files are out of this
 * execution's scope and are not modified here; `useAuth()` (see
 * `composables/useAuth.ts`) is the intended migration target for them.
 *
 * The store is the single place that calls
 * `core/auth/token-storage` mutators — components/composables should
 * always go through the store (or `useAuth()`), never touch storage
 * directly.
 */

import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { AuthService } from '../services/AuthService';
import {
  clearSession as clearPersistedSession,
  getStoredAccessToken,
  getStoredUser,
  setStoredAccessToken,
  setStoredUser,
} from '../../../core/auth/token-storage';
import { isAccessTokenValid } from '../../../core/auth/jwt.util';
import { hasAnyRole, hasPermission } from '../../../core/auth/permission-evaluator';
import type {
  AuthResponse,
  LoginRequest,
  PasswordRecoveryRequest,
  PasswordResetRequest,
  User,
  UserRegistrationRequest,
} from '../../../core/auth/types/auth.types';
import type { PermissionKey, RoleName } from '../../../core/constants/permissions.constants';
import type { ApiError } from '../../../core/api/types/api.types';
import { mapApiErrorToFieldErrors, type FieldErrorMap } from '../../../shared/validation/field-error-mapper';

type AuthStatus = 'idle' | 'loading' | 'success' | 'error';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(getStoredUser());
  const accessToken = ref<string | null>(getStoredAccessToken());
  const status = ref<AuthStatus>('idle');
  const errorMessage = ref<string | null>(null);
  const fieldErrors = ref<FieldErrorMap>({});
  const isInitialized = ref(false);

  const isAuthenticated = computed(
    () => Boolean(user.value) && isAccessTokenValid(accessToken.value),
  );
  const isLoading = computed(() => status.value === 'loading');

  function setSession(response: AuthResponse): void {
    user.value = response.user;
    accessToken.value = response.accessToken;
    setStoredAccessToken(response.accessToken);
    setStoredUser(response.user);
  }

  function resetSession(): void {
    user.value = null;
    accessToken.value = null;
    clearPersistedSession();
  }

  function resetFeedback(): void {
    errorMessage.value = null;
    fieldErrors.value = {};
  }

  /** Runs an auth action, tracking `status`/`errorMessage`/`fieldErrors` uniformly, then rethrows on failure. */
  async function runAction<TResult>(action: () => Promise<TResult>): Promise<TResult> {
    status.value = 'loading';
    resetFeedback();

    try {
      const result = await action();
      status.value = 'success';
      return result;
    } catch (thrown) {
      const apiError = thrown as ApiError;
      status.value = 'error';
      errorMessage.value = apiError.detail ?? apiError.title ?? 'Something went wrong. Please try again.';
      fieldErrors.value = mapApiErrorToFieldErrors(apiError);
      throw thrown;
    }
  }

  async function login(payload: LoginRequest): Promise<void> {
    const response = await runAction(() => AuthService.login(payload));
    setSession(response);
  }

  async function register(payload: UserRegistrationRequest): Promise<void> {
    const response = await runAction(() => AuthService.register(payload));
    setSession(response);
  }

  async function requestPasswordRecovery(payload: PasswordRecoveryRequest): Promise<void> {
    await runAction(() => AuthService.requestPasswordRecovery(payload));
  }

  async function resetPassword(payload: PasswordResetRequest): Promise<void> {
    await runAction(() => AuthService.resetPassword(payload));
  }

  /** Refreshes `user` from the server. Used standalone by the initialize() bootstrap flow below. */
  async function fetchCurrentUser(): Promise<void> {
    const currentUser = await AuthService.getCurrentUser();
    user.value = currentUser;
    setStoredUser(currentUser);
  }

  /**
   * Called once, near application startup (future root `main.ts`), to
   * validate a persisted token and rehydrate `user` before the router
   * renders any authenticated route.
   */
  async function initialize(): Promise<void> {
    if (isInitialized.value) return;

    const token = getStoredAccessToken();

    if (token && isAccessTokenValid(token)) {
      accessToken.value = token;
      try {
        await fetchCurrentUser();
      } catch {
        resetSession();
      }
    } else {
      resetSession();
    }

    isInitialized.value = true;
  }

  function logout(): void {
    resetSession();
    resetFeedback();
    status.value = 'idle';
  }

  function userHasRole(roleNames: ReadonlyArray<RoleName | string>): boolean {
    return hasAnyRole(user.value, roleNames);
  }

  function userHasPermission(permission: PermissionKey): boolean {
    return hasPermission(user.value, permission);
  }

  return {
    user,
    accessToken,
    status,
    errorMessage,
    fieldErrors,
    isInitialized,
    isAuthenticated,
    isLoading,
    login,
    register,
    requestPasswordRecovery,
    resetPassword,
    fetchCurrentUser,
    initialize,
    logout,
    userHasRole,
    userHasPermission,
  };
});
