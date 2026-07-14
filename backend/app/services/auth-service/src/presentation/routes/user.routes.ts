import type { FastifyInstance, preHandlerHookHandler } from 'fastify';
import type { UserController } from '../controllers/user.controller';
import { changePasswordValidator, updateCurrentUserValidator } from '../validators/user.validators';

export async function userRoutes(
  fastify: FastifyInstance,
  options: { controller: UserController; requireAuth: preHandlerHookHandler },
): Promise<void> {
  const { controller, requireAuth } = options;

  fastify.get('/users/me', { preHandler: requireAuth }, controller.getCurrentUser);
  fastify.patch(
    '/users/me',
    { preHandler: [requireAuth, updateCurrentUserValidator] },
    controller.updateCurrentUser as any,
  );
  fastify.patch(
    '/users/me/password',
    { preHandler: [requireAuth, changePasswordValidator] },
    controller.changePassword as any,
  );
}
