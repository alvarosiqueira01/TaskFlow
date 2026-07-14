import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthenticatedPrincipal, JwtVerifier } from '../../infrastructure/jwt/jwt-verifier';

export class AuthenticationError extends Error {
  constructor(message = 'Missing or invalid authentication token.') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthenticatedPrincipal;
  }
}

export function createAuthMiddleware(jwtVerifier: JwtVerifier) {
  return async function authMiddleware(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new AuthenticationError();
    }

    const token = authorizationHeader.substring('Bearer '.length).trim();
    if (!token) {
      throw new AuthenticationError();
    }

    request.user = jwtVerifier.verify(token);
  };
}
