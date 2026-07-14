import { FastifyInstance } from 'fastify';
import { registerCategoryRoutes } from './category.routes.js';
import { CategoryController } from '../controllers/category.controller.js';
import { createAuthenticateMiddleware } from '../middleware/authenticate.middleware.js';
import { JwtVerifier } from '../../infrastructure/jwt/jwt-verifier.js';

export interface RouteControllers {
  categoryController: CategoryController;
}

export async function registerRoutes(
  app: FastifyInstance,
  controllers: RouteControllers,
  jwtVerifier: JwtVerifier,
): Promise<void> {
  app.addHook('onRequest', createAuthenticateMiddleware(jwtVerifier));

  await registerCategoryRoutes(app, controllers.categoryController);
}
