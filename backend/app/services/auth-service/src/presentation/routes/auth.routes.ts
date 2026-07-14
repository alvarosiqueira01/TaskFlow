import type { FastifyInstance } from 'fastify';
import type { AuthController } from '../controllers/auth.controller';
import {
  loginValidator,
  registerUserValidator,
  requestPasswordRecoveryValidator,
  resetPasswordValidator,
} from '../validators/auth.validators';

export async function authRoutes(fastify: FastifyInstance, options: { controller: AuthController }): Promise<void> {
  const { controller } = options;

  fastify.post('/auth/register', { preHandler: registerUserValidator }, controller.register as any);
  fastify.post('/auth/login', { preHandler: loginValidator }, controller.login as any);
  fastify.post(
    '/auth/password/recovery',
    { preHandler: requestPasswordRecoveryValidator },
    controller.requestPasswordRecovery as any,
  );
  fastify.post('/auth/password/reset', { preHandler: resetPasswordValidator }, controller.resetPassword as any);
}
