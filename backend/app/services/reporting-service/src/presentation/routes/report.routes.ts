import { FastifyInstance } from 'fastify';
import { ReportController } from '../controllers/report.controller.js';
import { completedTasksReportQuerySchema } from '../../schemas/report.schema.js';
import { AuthenticatedRequest } from '../middleware/authenticate.middleware.js';

export async function registerReportRoutes(app: FastifyInstance, controller: ReportController): Promise<void> {
  app.get('/reports/dashboard', async (request, reply) => {
    await controller.dashboard(request as AuthenticatedRequest, reply);
  });

  app.get('/reports/completed', async (request, reply) => {
    request.query = completedTasksReportQuerySchema.parse(request.query);
    await controller.completed(request as AuthenticatedRequest, reply);
  });

  app.get('/reports/pending', async (request, reply) => {
    await controller.pending(request as AuthenticatedRequest, reply);
  });
}
