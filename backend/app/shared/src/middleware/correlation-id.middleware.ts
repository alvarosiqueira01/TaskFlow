import type { FastifyReply, FastifyRequest } from 'fastify';
import { randomUUID } from 'node:crypto';
import { HTTP_HEADERS } from '../config/constants';

export async function correlationIdMiddleware(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const incoming = request.headers[HTTP_HEADERS.CORRELATION_ID];
  const correlationId = Array.isArray(incoming) ? incoming[0] : incoming ?? randomUUID();

  request.correlationId = correlationId;
  reply.header(HTTP_HEADERS.CORRELATION_ID, correlationId);
}
