/**
 * features/auth/types/index.ts
 *
 * Re-exports the canonical identity DTOs from `core/auth` (per that
 * module's own note: "the future auth feature should import and
 * re-export these types rather than redeclaring them"), alongside this
 * feature's own form-state and validation schema types.
 */

export type {
  User,
  Role,
  AuthResponse,
  LoginRequest,
  UserRegistrationRequest,
  PasswordRecoveryRequest,
  PasswordResetRequest,
} from '../../../core/auth/types/auth.types';

export * from './auth-form.types';
export * from './auth-validation.schemas';
