import { FastifyReply } from 'fastify';
import { AuthenticatedRequest } from '../middleware/authenticate.middleware.js';
import { GetDashboardReportUseCase } from '../../application/use-cases/get-dashboard-report.use-case.js';
import { GetCompletedTasksReportUseCase } from '../../application/use-cases/get-completed-tasks-report.use-case.js';
import { GetPendingTasksReportUseCase } from '../../application/use-cases/get-pending-tasks-report.use-case.js';
import { TaskProjectionMapper } from '../../contracts/mappers/task-projection.mapper.js';
import { CompletedTasksReportQuery } from '../../schemas/report.schema.js';
import { HTTP_STATUS } from '../../config/constants.js';

export class ReportController {
  constructor(
    private readonly getDashboardReportUseCase: GetDashboardReportUseCase,
    private readonly getCompletedTasksReportUseCase: GetCompletedTasksReportUseCase,
    private readonly getPendingTasksReportUseCase: GetPendingTasksReportUseCase,
  ) {}

  async dashboard(request: AuthenticatedRequest, reply: FastifyReply): Promise<void> {
    const user = request.user!;

    const stats = await this.getDashboardReportUseCase.execute({
      requesterId: user.id,
      requesterRoles: user.roles,
    });

    await reply.status(HTTP_STATUS.OK).send(stats);
  }

  async completed(request: AuthenticatedRequest, reply: FastifyReply): Promise<void> {
    const user = request.user!;
    const { startDate, endDate } = request.query as CompletedTasksReportQuery;

    const taskProjections = await this.getCompletedTasksReportUseCase.execute({
      requesterId: user.id,
      requesterRoles: user.roles,
      startDate,
      endDate,
    });

    await reply
      .status(HTTP_STATUS.OK)
      .send(TaskProjectionMapper.toCompletedReportResponse(taskProjections, startDate, endDate));
  }

  async pending(request: AuthenticatedRequest, reply: FastifyReply): Promise<void> {
    const user = request.user!;

    const taskProjections = await this.getPendingTasksReportUseCase.execute({
      requesterId: user.id,
      requesterRoles: user.roles,
    });

    await reply.status(HTTP_STATUS.OK).send(TaskProjectionMapper.toPendingReportResponse(taskProjections));
  }
}
