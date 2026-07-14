import type { Logger } from '../logging/logger';
import type { JwtPayload } from './jwt-payload';

declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload;
    correlationId?: string;
    log: Logger;
  }
}
export {};
