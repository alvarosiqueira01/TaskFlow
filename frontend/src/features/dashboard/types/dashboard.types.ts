/**
 * NOTE: TaskStatus/TaskPriority mirror components.schemas.TaskStatus and
 * components.schemas.TaskPriority from the API contract (swagger.yaml).
 * They are intentionally duplicated here instead of imported from the
 * `tasks` feature, per the Frontend Architecture Standard rule that
 * features must never depend directly on one another. If a canonical
 * definition already exists under `shared/types`, prefer that one.
 */
export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export const TASK_STATUS_VALUES: readonly TaskStatus[] = [
  'BACKLOG',
  'TODO',
  'IN_PROGRESS',
  'REVIEW',
  'COMPLETED',
];

export const TASK_PRIORITY_VALUES: readonly TaskPriority[] = [
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
];

export type NotificationType = 'ASSIGNMENT' | 'TASK_UPDATED' | 'MENTION';

/**
 * Maps 1:1 to components.schemas.ReportDashboard.
 */
export interface DashboardMetrics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
}

export interface StatusBreakdownItem {
  status: TaskStatus;
  label: string;
  count: number;
}

export interface PriorityBreakdownItem {
  priority: TaskPriority;
  label: string;
  count: number;
}

/**
 * Reduced projection of components.schemas.Task, scoped to what the
 * "Upcoming Deadlines" widget needs.
 */
export interface UpcomingDeadlineItem {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
}

/**
 * Reduced projection of components.schemas.Notification, scoped to what
 * the "Recent Activity" widget needs.
 */
export interface RecentActivityItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardState {
  metrics: DashboardMetrics | null;
  statusBreakdown: StatusBreakdownItem[];
  priorityMix: PriorityBreakdownItem[];
  upcomingDeadlines: UpcomingDeadlineItem[];
  recentActivity: RecentActivityItem[];

  isLoadingMetrics: boolean;
  isLoadingStatusBreakdown: boolean;
  isLoadingPriorityMix: boolean;
  isLoadingUpcomingDeadlines: boolean;
  isLoadingRecentActivity: boolean;

  errorMetrics: string | null;
  errorStatusBreakdown: string | null;
  errorPriorityMix: string | null;
  errorUpcomingDeadlines: string | null;
  errorRecentActivity: string | null;
}
