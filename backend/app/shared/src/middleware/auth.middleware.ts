import type { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { AUTH, HTTP_HEADERS } from '../config/constants';
import { ErrorCode } from '../errors/error-codes';
import { HttpError } from '../errors/http-error';
import type { JwtPayload } from '../types/jwt-payload';

export interface AuthMiddlewareOptions {
  jwtSecret: string;
}

export function buildAuthMiddleware(options: AuthMiddlewareOptions) {
  return async function authMiddleware(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
    const header = request.headers[HTTP_HEADERS.AUTHORIZATION];

    if (!header || Array.isArray(header) || !header.startsWith(AUTH.BEARER_PREFIX)) {
      throw new HttpError(401, ErrorCode.UNAUTHORIZED, 'Missing or malformed Authorization header');
    }

    const token = header.slice(AUTH.BEARER_PREFIX.length);

    try {
      const decoded = jwt.verify(token, options.jwtSecret) as JwtPayload & { id: string };
      request.user = decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new HttpError(401, ErrorCode.TOKEN_EXPIRED, 'Authentication token has expired');
      }
      throw new HttpError(401, ErrorCode.TOKEN_INVALID, 'Authentication token is invalid');
    }
  };
}

export function requireRoles(...allowedRoleNames: string[]) {
  return async function roleGuardMiddleware(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
    if (!request.user) throw new HttpError(401, ErrorCode.UNAUTHORIZED, 'Authentication is required');
    const hasRole = request.user.roles.some((role) => allowedRoleNames.includes(role));
    if (!hasRole) throw new HttpError(403, ErrorCode.FORBIDDEN, 'You do not have permission to perform this action');
  };
}
