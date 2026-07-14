/**
 * features/auth/types/auth-form.types.ts
 *
 * Local form state shapes for the auth feature's pages. These are
 * intentionally separate from the request DTOs in `core/auth/types`
 * (`LoginRequest`, `UserRegistrationRequest`, ...): form state tracks
 * what the user is actively typing (including UI-only fields like a
 * "confirm password" input that the API never sees), while the DTO is
 * the exact payload sent over the wire.
 */

export interface LoginFormState {
  email: string;
  password: string;
}

export interface RegisterFormState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export interface ForgotPasswordFormState {
  email: string;
}

export interface ResetPasswordFormState {
  newPassword: string;
  confirmPassword: string;
}
