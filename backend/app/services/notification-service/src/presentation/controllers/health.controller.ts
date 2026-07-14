import { FastifyReply, FastifyRequest } from 'fastify';
import { HealthResponse } from '../../contracts/dtos/health.dto.js';
import { SERVICE_NAME, HTTP_STATUS } from '../../config/constants.js';

export class HealthController {
  async check(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const response: HealthResponse = { status: 'ok', service: SERVICE_NAME };
    await reply.status(HTTP_STATUS.OK).send(response);
  }
}
