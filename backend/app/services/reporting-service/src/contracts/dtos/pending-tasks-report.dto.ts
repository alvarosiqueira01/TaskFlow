import { TaskSummaryResponse } from './task-summary.dto.js';

export interface PendingTasksReportResponse {
  totalPending: number;
  byStatus: Record<string, number>;
  items: TaskSummaryResponse[];
}
