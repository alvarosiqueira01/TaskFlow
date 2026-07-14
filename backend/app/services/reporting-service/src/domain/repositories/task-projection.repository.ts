import { TaskProjection } from '../entities/task-projection.entity.js';

export interface TaskReportFilter {
  /** When set, restricts results to tasks owned by this user (non-privileged requesters). */
  ownerId?: string;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
}

export interface TaskProjectionRepository {
  upsert(taskProjection: TaskProjection): Promise<void>;
  findById(taskId: string): Promise<TaskProjection | null>;
  incrementCommentsCount(taskId: string): Promise<void>;
  incrementMediaCount(taskId: string): Promise<void>;
  decrementMediaCount(taskId: string): Promise<void>;
  findCompleted(filter: TaskReportFilter & { startDate?: Date; endDate?: Date }): Promise<TaskProjection[]>;
  findPending(filter: TaskReportFilter): Promise<TaskProjection[]>;
  getDashboardStats(filter: TaskReportFilter): Promise<DashboardStats>;
}
