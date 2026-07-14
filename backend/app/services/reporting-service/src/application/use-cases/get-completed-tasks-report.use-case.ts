import { TaskProjection } from '../../domain/entities/task-projection.entity.js';
import { TaskProjectionRepository } from '../../domain/repositories/task-projection.repository.js';
import { InvalidDateRangeError } from '../../domain/exceptions/reporting.exceptions.js';
import { REPORT_PRIVILEGED_ROLES } from '../../config/constants.js';

export interface GetCompletedTasksReportQuery {
  requesterId: string;
  requesterRoles: string[];
  startDate?: string;
  endDate?: string;
}

export class GetCompletedTasksReportUseCase {
  constructor(private readonly taskProjectionRepository: TaskProjectionRepository) {}

  async execute(query: GetCompletedTasksReportQuery): Promise<TaskProjection[]> {
    const startDate = query.startDate ? new Date(query.startDate) : undefined;
    const endDate = query.endDate ? new Date(query.endDate) : undefined;

    if (startDate && endDate && startDate.getTime() > endDate.getTime()) {
      throw new InvalidDateRangeError();
    }

    const isPrivileged = query.requesterRoles.some((role) =>
      (REPORT_PRIVILEGED_ROLES as readonly string[]).includes(role),
    );

    return this.taskProjectionRepository.findCompleted({
      ownerId: isPrivileged ? undefined : query.requesterId,
      startDate,
      endDate,
    });
  }
}
