import { TaskProjection } from '../../domain/entities/task-projection.entity.js';
import { TaskProjectionRepository } from '../../domain/repositories/task-projection.repository.js';
import { REPORT_PRIVILEGED_ROLES } from '../../config/constants.js';

export interface GetPendingTasksReportQuery {
  requesterId: string;
  requesterRoles: string[];
}

export class GetPendingTasksReportUseCase {
  constructor(private readonly taskProjectionRepository: TaskProjectionRepository) {}

  async execute(query: GetPendingTasksReportQuery): Promise<TaskProjection[]> {
    const isPrivileged = query.requesterRoles.some((role) =>
      (REPORT_PRIVILEGED_ROLES as readonly string[]).includes(role),
    );

    return this.taskProjectionRepository.findPending({
      ownerId: isPrivileged ? undefined : query.requesterId,
    });
  }
}
