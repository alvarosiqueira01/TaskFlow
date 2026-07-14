import { TaskSummaryResponse } from './task-summary.dto.js';

export interface CompletedTasksReportResponse {
  startDate?: string;
  endDate?: string;
  totalCompleted: number;
  items: TaskSummaryResponse[];
}
