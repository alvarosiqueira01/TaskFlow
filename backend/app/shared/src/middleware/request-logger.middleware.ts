import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Logger } from '../logging/logger';
import { withCorrelationId } from '../logging/logger';

export function buildRequestLoggerMiddleware(baseLogger: Logger) {
  return async function requestLoggerMiddleware(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const correlationId = request.correlationId ?? 'unknown';
    const childLogger = withCorrelationId(baseLogger, correlationId);
    request.log = childLogger;

    childLogger.info({ method: request.method, url: request.url }, 'incoming request');

    reply.raw.once('finish', () => {
      childLogger.info({ method: request.method, url: request.url, statusCode: reply.statusCode }, 'request completed');
    });
  };
}
