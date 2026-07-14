import { FastifyInstance } from 'fastify';
import { HealthController } from '../controllers/health.controller.js';

export async function registerHealthRoutes(app: FastifyInstance, controller: HealthController): Promise<void> {
  app.get('/health', async (request, reply) => {
    await controller.check(request, reply);
  });
}
