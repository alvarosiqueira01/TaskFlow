import { FastifyReply, FastifyRequest } from 'fastify';
import { JwtVerificationError, JwtVerifier } from '../../infrastructure/jwt/jwt-verifier.js';

export interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    id: string;
    roles: string[];
  };
}

export function createAuthenticateMiddleware(jwtVerifier: JwtVerifier) {
  return async function authenticate(request: AuthenticatedRequest, reply: FastifyReply): Promise<void> {
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      await reply.status(401).send({
        type: 'https://api.taskmanager.local/errors/unauthorized',
        title: 'Unauthorized',
        status: 401,
        detail: 'Missing or invalid Authorization header',
      });
      return;
    }

    const token = authorizationHeader.substring('Bearer '.length);

    try {
      const claims = jwtVerifier.verify(token);
      request.user = claims;
    } catch (error) {
      if (error instanceof JwtVerificationError) {
        await reply.status(401).send({
          type: 'https://api.taskmanager.local/errors/unauthorized',
          title: 'Unauthorized',
          status: 401,
          detail: error.message,
        });
        return;
      }
      throw error;
    }
  };
}
