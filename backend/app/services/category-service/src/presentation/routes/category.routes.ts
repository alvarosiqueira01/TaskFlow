import { FastifyInstance } from 'fastify';
import { CategoryController } from '../controllers/category.controller.js';
import { categoryInputSchema } from '../../schemas/category.schema.js';
import { AuthenticatedRequest } from '../middleware/authenticate.middleware.js';

export async function registerCategoryRoutes(app: FastifyInstance, controller: CategoryController): Promise<void> {
  app.get('/categories', async (request, reply) => {
    await controller.list(request as AuthenticatedRequest, reply);
  });

  app.post('/categories', async (request, reply) => {
    request.body = categoryInputSchema.parse(request.body);
    await controller.create(request as AuthenticatedRequest, reply);
  });
}
