import { FastifyInstance } from 'fastify';
import { registerReportRoutes } from './report.routes.js';
import { ReportController } from '../controllers/report.controller.js';
import { createAuthenticateMiddleware } from '../middleware/authenticate.middleware.js';
import { JwtVerifier } from '../../infrastructure/jwt/jwt-verifier.js';

export interface RouteControllers {
  reportController: ReportController;
}

export async function registerRoutes(
  app: FastifyInstance,
  controllers: RouteControllers,
  jwtVerifier: JwtVerifier,
): Promise<void> {
  app.addHook('onRequest', createAuthenticateMiddleware(jwtVerifier));

  await registerReportRoutes(app, controllers.reportController);
}
