import { DashboardStats, TaskProjectionRepository } from '../../domain/repositories/task-projection.repository.js';
import { REPORT_PRIVILEGED_ROLES } from '../../config/constants.js';

export interface GetDashboardReportQuery {
  requesterId: string;
  requesterRoles: string[];
}

export class GetDashboardReportUseCase {
  constructor(private readonly taskProjectionRepository: TaskProjectionRepository) {}

  async execute(query: GetDashboardReportQuery): Promise<DashboardStats> {
    const isPrivileged = query.requesterRoles.some((role) =>
      (REPORT_PRIVILEGED_ROLES as readonly string[]).includes(role),
    );

    return this.taskProjectionRepository.getDashboardStats({
      ownerId: isPrivileged ? undefined : query.requesterId,
    });
  }
}
