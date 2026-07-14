/**
 * features/auth/services/AuthService.ts
 *
 * Owns every call to the swagger.yaml "Authentication" tag:
 * `POST /auth/register`, `POST /auth/login`,
 * `POST /auth/password/recovery`, `POST /auth/password/reset`.
 *
 * `getCurrentUser` (`GET /users/me`, tagged "Users" in swagger.yaml) is
 * included here too, specifically for session bootstrap/rehydration —
 * verifying a persisted token is still valid and refreshing the
 * `User` on app startup is a standard `authStore` responsibility (see
 * `UI-UX-guidelines.md` section 30, which lists `authStore` and
 * `userStore` as distinct stores). Profile editing
 * (`PATCH /users/me`) and password change (`PATCH /users/me/password`)
 * belong to a future `users` feature and are intentionally NOT
 * implemented here.
 *
 * No business logic lives here — only request/response mapping, per
 * `frontend-architecture-standard.md`'s `services/` responsibilities.
 */

import { httpClient } from '../../../core/api/http-client';
import { API_ENDPOINTS } from '../../../core/config/api-endpoints.config';
import type {
  AuthResponse,
  LoginRequest,
  PasswordRecoveryRequest,
  PasswordResetRequest,
  User,
  UserRegistrationRequest,
} from '../../../core/auth/types/auth.types';

export const AuthService = {
  async register(payload: UserRegistrationRequest): Promise<AuthResponse> {
    const { data } = await httpClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, payload);
    return data;
  },

  async login(payload: LoginRequest): Promise<AuthResponse> {
    const { data } = await httpClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, payload);
    return data;
  },

  /** Always resolves (202 Accepted) regardless of whether the email exists, per swagger.yaml's documented behavior. */
  async requestPasswordRecovery(payload: PasswordRecoveryRequest): Promise<void> {
    await httpClient.post(API_ENDPOINTS.AUTH.PASSWORD_RECOVERY, payload);
  },

  async resetPassword(payload: PasswordResetRequest): Promise<void> {
    await httpClient.post(API_ENDPOINTS.AUTH.PASSWORD_RESET, payload);
  },

  /** Used only to (re)hydrate the session on app startup — see module doc comment above. */
  async getCurrentUser(): Promise<User> {
    const { data } = await httpClient.get<User>(API_ENDPOINTS.USERS.ME);
    return data;
  },
};
