import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { TaskController } from '../controllers/task.controller';
import { createAuthMiddleware } from '../middleware/auth.middleware';
import { JwtVerifier } from '../../infrastructure/jwt/jwt-verifier';

export interface TaskRoutesOptions extends FastifyPluginOptions {
  taskController: TaskController;
  jwtVerifier: JwtVerifier;
}

export async function taskRoutes(app: FastifyInstance, options: TaskRoutesOptions): Promise<void> {
  const { taskController, jwtVerifier } = options;
  const authenticate = createAuthMiddleware(jwtVerifier);

  app.addHook('preHandler', authenticate);

  app.get('/tasks', taskController.list);
  app.post('/tasks', taskController.create);
  app.get('/tasks/:id', taskController.getById);
  app.put('/tasks/:id', taskController.update);
  app.delete('/tasks/:id', taskController.remove);
  app.get('/tasks/:id/history', taskController.history);
}
