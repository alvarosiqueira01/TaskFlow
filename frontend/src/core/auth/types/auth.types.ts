/**
 * core/auth/types/auth.types.ts
 *
 * Canonical identity contracts, mirrored 1:1 from the `components.schemas`
 * section of swagger.yaml (`User`, `Role`, `AuthResponse`, ...).
 *
 * These live in `core/auth` (rather than a feature's `types/` folder)
 * because core infrastructure — the HTTP client, navigation guards,
 * and layouts — must be able to reason about "who is the current user"
 * without depending on the `auth` feature module. The future `auth`
 * feature should import and re-export these types rather than
 * redeclaring them.
 */

export interface Role {
  id: string;
  name: string;
  description?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  isActive: boolean;
  roles?: Role[];
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserRegistrationRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface PasswordRecoveryRequest {
  email: string;
}

export interface PasswordResetRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  avatarUrl?: string;
}

/** Decoded payload of the backend-issued JWT (standard claims only). */
export interface DecodedAccessToken {
  sub: string;
  exp: number;
  iat?: number;
  [claim: string]: unknown;
}
