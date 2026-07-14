import type { FastifyInstance, preHandlerHookHandler } from 'fastify';
import type { RoleController } from '../controllers/role.controller';
import { updateUserRolesValidator, userIdParamValidator } from '../validators/role.validators';

export async function roleRoutes(
  fastify: FastifyInstance,
  options: { controller: RoleController; requireAuth: preHandlerHookHandler; requireAdmin: preHandlerHookHandler },
): Promise<void> {
  const { controller, requireAuth, requireAdmin } = options;

  fastify.get('/roles', { preHandler: [requireAuth, requireAdmin] }, controller.listRoles);

  fastify.get(
    '/users/:id/roles',
    { preHandler: [requireAuth, requireAdmin, userIdParamValidator] },
    controller.getUserRoles as any,
  );

  fastify.put(
    '/users/:id/roles',
    { preHandler: [requireAuth, requireAdmin, updateUserRolesValidator] },
    controller.updateUserRoles as any,
  );
}
