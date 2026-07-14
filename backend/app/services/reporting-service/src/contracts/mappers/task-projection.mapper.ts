import { TaskProjection } from '../../domain/entities/task-projection.entity.js';
import { TaskSummaryResponse } from '../dtos/task-summary.dto.js';
import { CompletedTasksReportResponse } from '../dtos/completed-tasks-report.dto.js';
import { PendingTasksReportResponse } from '../dtos/pending-tasks-report.dto.js';

export class TaskProjectionMapper {
  static toSummaryResponse(taskProjection: TaskProjection): TaskSummaryResponse {
    const primitives = taskProjection.toPrimitives();
    return {
      id: primitives.id,
      title: primitives.title,
      status: primitives.status.toString(),
      priority: primitives.priority,
      categoryId: primitives.categoryId ?? undefined,
      dueDate: primitives.dueDate ? primitives.dueDate.toISOString() : undefined,
      completedAt: primitives.completedAt ? primitives.completedAt.toISOString() : undefined,
      commentsCount: primitives.commentsCount,
      mediaCount: primitives.mediaCount,
      createdAt: primitives.createdAt.toISOString(),
      updatedAt: primitives.updatedAt.toISOString(),
    };
  }

  static toCompletedReportResponse(
    taskProjections: TaskProjection[],
    startDate?: string,
    endDate?: string,
  ): CompletedTasksReportResponse {
    return {
      startDate,
      endDate,
      totalCompleted: taskProjections.length,
      items: taskProjections.map((taskProjection) => this.toSummaryResponse(taskProjection)),
    };
  }

  static toPendingReportResponse(taskProjections: TaskProjection[]): PendingTasksReportResponse {
    const byStatus: Record<string, number> = {};
    for (const taskProjection of taskProjections) {
      const status = taskProjection.status.toString();
      byStatus[status] = (byStatus[status] ?? 0) + 1;
    }

    return {
      totalPending: taskProjections.length,
      byStatus,
      items: taskProjections.map((taskProjection) => this.toSummaryResponse(taskProjection)),
    };
  }
}
