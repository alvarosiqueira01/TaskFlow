// Assumes a centralized Axios instance is exported from core/api, per
// Frontend Architecture Standard ("core/api/ - Axios instance, interceptors").
import { httpClient } from '@/core/api/http-client';
import type {
  DashboardMetrics,
  StatusBreakdownItem,
  PriorityBreakdownItem,
  UpcomingDeadlineItem,
  RecentActivityItem,
  TaskStatus,
  TaskPriority,
} from '../types/dashboard.types';
import { TASK_STATUS_VALUES, TASK_PRIORITY_VALUES } from '../types/dashboard.types';

const STATUS_LABELS: Record<TaskStatus, string> = {
  BACKLOG: 'Backlog',
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  REVIEW: 'Review',
  COMPLETED: 'Completed',
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  CRITICAL: 'Critical',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
};

/** Mirrors components.schemas.CursorPaginatedResponse (allOf items). */
interface CursorPaginatedResponseDto<T> {
  limit: number;
  nextCursor: string | null;
  total?: number;
  items: T[];
}

/** Reduced fields of components.schemas.Task used by this feature. */
interface TaskResponseDto {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
}

/** Reduced fields of components.schemas.Notification used by this feature. */
interface NotificationResponseDto {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

type NotificationType = RecentActivityItem['type'];

/** Reduced fields of components.schemas.ReportDashboard. */
interface ReportDashboardDto {
  totalTasks?: number;
  completedTasks?: number;
  pendingTasks?: number;
  overdueTasks?: number;
}

export class DashboardService {
  /**
   * GET /reports/dashboard
   */
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const { data } = await httpClient.get<ReportDashboardDto>('/reports/dashboard');

    return {
      totalTasks: data.totalTasks ?? 0,
      completedTasks: data.completedTasks ?? 0,
      pendingTasks: data.pendingTasks ?? 0,
      overdueTasks: data.overdueTasks ?? 0,
    };
  }

  /**
   * Derives per-status counts using GET /tasks?status=X&limit=1, reading
   * the optional `total` field from CursorPaginatedResponse. One request
   * per TaskStatus enum value, since the contract has no aggregate
   * breakdown endpoint.
   */
  async getStatusBreakdown(): Promise<StatusBreakdownItem[]> {
    const responses = await Promise.all(
      TASK_STATUS_VALUES.map((status) =>
        httpClient.get<CursorPaginatedResponseDto<TaskResponseDto>>('/tasks', {
          params: { status, limit: 1 },
        })
      )
    );

    return TASK_STATUS_VALUES.map((status, index) => ({
      status,
      label: STATUS_LABELS[status],
      count: responses[index].data.total ?? responses[index].data.items.length,
    }));
  }

  /**
   * Derives per-priority counts using GET /tasks?priority=X&limit=1.
   */
  async getPriorityMix(): Promise<PriorityBreakdownItem[]> {
    const responses = await Promise.all(
      TASK_PRIORITY_VALUES.map((priority) =>
        httpClient.get<CursorPaginatedResponseDto<TaskResponseDto>>('/tasks', {
          params: { priority, limit: 1 },
        })
      )
    );

    return TASK_PRIORITY_VALUES.map((priority, index) => ({
      priority,
      label: PRIORITY_LABELS[priority],
      count: responses[index].data.total ?? responses[index].data.items.length,
    }));
  }

  /**
   * GET /tasks?sortBy=dueDate&sortOrder=asc&limit=N
   */
  async getUpcomingDeadlines(limit = 5): Promise<UpcomingDeadlineItem[]> {
    const { data } = await httpClient.get<CursorPaginatedResponseDto<TaskResponseDto>>('/tasks', {
      params: {
        sortBy: 'dueDate',
        sortOrder: 'asc',
        limit,
      },
    });

    return data.items.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ?? null,
    }));
  }

  /**
   * GET /notifications?limit=N
   * Used as the data source for the "Recent Activity" widget, since the
   * contract has no dedicated global activity-feed endpoint.
   */
  async getRecentActivity(limit = 8): Promise<RecentActivityItem[]> {
    const { data } = await httpClient.get<CursorPaginatedResponseDto<NotificationResponseDto>>(
      '/notifications',
      { params: { limit } }
    );

    return data.items.map((notification) => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
    }));
  }
}

export const dashboardService = new DashboardService();
