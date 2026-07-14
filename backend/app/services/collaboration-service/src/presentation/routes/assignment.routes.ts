import { FastifyInstance } from 'fastify';
import { AssignmentController } from '../controllers/assignment.controller.js';
import { assignUserToTaskBodySchema, taskIdParamSchema } from '../../schemas/assignment.schema.js';
import { AuthenticatedRequest } from '../middleware/authenticate.middleware.js';

export async function registerAssignmentRoutes(
  app: FastifyInstance,
  controller: AssignmentController,
): Promise<void> {
  app.get('/tasks/:id/assignments', async (request, reply) => {
    taskIdParamSchema.parse(request.params);
    await controller.list(request as AuthenticatedRequest, reply);
  });

  app.post('/tasks/:id/assignments', async (request, reply) => {
    taskIdParamSchema.parse(request.params);
    request.body = assignUserToTaskBodySchema.parse(request.body);
    await controller.assign(request as AuthenticatedRequest, reply);
  });

  app.delete('/tasks/:id/assignments/:userId', async (request, reply) => {
    await controller.remove(request as AuthenticatedRequest, reply);
  });
}
