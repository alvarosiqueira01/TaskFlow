import type { FastifyInstance } from 'fastify';
import type { AppContainer } from '../../config/container';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';
import { roleRoutes } from './role.routes';

export async function registerRoutes(fastify: FastifyInstance, container: AppContainer): Promise<void> {
  await fastify.register(authRoutes, { controller: container.controllers.authController });

  await fastify.register(userRoutes, {
    controller: container.controllers.userController,
    requireAuth: container.middleware.requireAuth,
  });

  await fastify.register(roleRoutes, {
    controller: container.controllers.roleController,
    requireAuth: container.middleware.requireAuth,
    requireAdmin: container.middleware.requireAdmin,
  });
}
