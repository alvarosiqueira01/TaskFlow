import { FastifyInstance } from 'fastify';
import { CommentController } from '../controllers/comment.controller.js';
import { commentInputSchema, taskCommentsQuerySchema } from '../../schemas/comment.schema.js';
import { taskIdParamSchema } from '../../schemas/assignment.schema.js';
import { AuthenticatedRequest } from '../middleware/authenticate.middleware.js';

export async function registerCommentRoutes(app: FastifyInstance, controller: CommentController): Promise<void> {
  app.get('/tasks/:id/comments', async (request, reply) => {
    taskIdParamSchema.parse(request.params);
    request.query = taskCommentsQuerySchema.parse(request.query);
    await controller.list(request as AuthenticatedRequest, reply);
  });

  app.post('/tasks/:id/comments', async (request, reply) => {
    taskIdParamSchema.parse(request.params);
    request.body = commentInputSchema.parse(request.body);
    await controller.create(request as AuthenticatedRequest, reply);
  });
}
