import { FastifyInstance } from 'fastify';
import { registerHealthRoutes } from './health.routes.js';
import { HealthController } from '../controllers/health.controller.js';

export interface RouteControllers {
  healthController: HealthController;
}

export async function registerRoutes(app: FastifyInstance, controllers: RouteControllers): Promise<void> {
  await registerHealthRoutes(app, controllers.healthController);
}
