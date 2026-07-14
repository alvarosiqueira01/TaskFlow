import { createHash, randomBytes } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { ErrorCode, HttpError } from '@backend/shared';
import type {
  AccessTokenClaims,
  TokenService,
} from '../../domain/services/token-service';

export interface JsonWebTokenServiceOptions {
  jwtSecret: string;
  jwtExpiresIn: string;
  passwordResetSecret: string;
}

export class JsonWebTokenService implements TokenService {
  constructor(private readonly options: JsonWebTokenServiceOptions) {}

  generateAccessToken(claims: AccessTokenClaims): string {
    return jwt.sign(claims, this.options.jwtSecret, { expiresIn: this.options.jwtExpiresIn as any});
  }

  verifyAccessToken(token: string): AccessTokenClaims {
    try {
      return jwt.verify(token, this.options.jwtSecret) as AccessTokenClaims;
    } catch {
      throw new HttpError(401, ErrorCode.TOKEN_INVALID, 'Authentication token is invalid');
    }
  }

  generatePasswordRecoveryToken(userId: string): { rawToken: string; tokenHash: string } {
    const rawToken = `${userId}.${randomBytes(32).toString('hex')}`;
    return { rawToken, tokenHash: this.hashPasswordRecoveryToken(rawToken) };
  }

  hashPasswordRecoveryToken(rawToken: string): string {
    return createHash('sha256').update(`${rawToken}:${this.options.passwordResetSecret}`).digest('hex');
  }
}
