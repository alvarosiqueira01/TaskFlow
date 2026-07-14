import { FastifyInstance } from 'fastify';
import { NotificationController } from '../controllers/notification.controller.js';
import { notificationIdParamSchema, notificationsQuerySchema } from '../../schemas/notification.schema.js';
import { AuthenticatedRequest } from '../middleware/authenticate.middleware.js';

export async function registerNotificationRoutes(
  app: FastifyInstance,
  controller: NotificationController,
): Promise<void> {
  app.get('/notifications', async (request, reply) => {
    request.query = notificationsQuerySchema.parse(request.query);
    await controller.list(request as AuthenticatedRequest, reply);
  });

  app.patch('/notifications/:id/read', async (request, reply) => {
    notificationIdParamSchema.parse(request.params);
    await controller.markRead(request as AuthenticatedRequest, reply);
  });

  app.patch('/notifications/read-all', async (request, reply) => {
    await controller.markAllRead(request as AuthenticatedRequest, reply);
  });
}
