import type { UserRole } from '@backend/shared';

export interface AccessTokenClaims {
  sub: string;
  email: string;
  role: UserRole;
}

export interface PasswordRecoveryTokenClaims {
  sub: string;
  purpose: 'password-recovery';
}

/**
 * Domain-level port for token generation/verification (JWT).
 * Implementations (Infrastructure) depend on the `jsonwebtoken` library.
 */
export interface TokenService {
  generateAccessToken(claims: AccessTokenClaims): string;
  verifyAccessToken(token: string): AccessTokenClaims;
  generatePasswordRecoveryToken(userId: string): { rawToken: string; tokenHash: string };
  hashPasswordRecoveryToken(rawToken: string): string;
}
