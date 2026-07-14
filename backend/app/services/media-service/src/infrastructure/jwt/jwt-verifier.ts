import jwt from 'jsonwebtoken';

export interface AuthenticatedPrincipal {
  id: string;
  roles: string[];
}

export class JwtTokenInvalidError extends Error {
  constructor(message = 'Invalid or expired authentication token.') {
    super(message);
    this.name = 'JwtTokenInvalidError';
  }
}

export class JwtVerifier {
  constructor(private readonly secretOrPublicKey: string) {}

  verify(token: string): AuthenticatedPrincipal {
    try {
      const decoded = jwt.verify(token, this.secretOrPublicKey) as jwt.JwtPayload;

      const subject = decoded.sub;
      if (!subject || typeof subject !== 'string') {
        throw new JwtTokenInvalidError('Token is missing a valid subject claim.');
      }

      const roles = Array.isArray(decoded.roles) ? (decoded.roles as string[]) : [];

      return { id: subject, roles };
    } catch (error) {
      if (error instanceof JwtTokenInvalidError) {
        throw error;
      }
      throw new JwtTokenInvalidError();
    }
  }
}
