/**
 * NOTE: mirrors components.schemas.TaskStatus. Duplicated locally rather
 * than imported from features/tasks or features/dashboard, per the
 * Frontend Architecture Standard's "features must never depend on one
 * another" rule.
 */
export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';

export const TASK_STATUS_VALUES: readonly TaskStatus[] = [
  'BACKLOG',
  'TODO',
  'IN_PROGRESS',
  'REVIEW',
  'COMPLETED',
];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  BACKLOG: 'Backlog',
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  REVIEW: 'Review',
  COMPLETED: 'Completed',
};

/** Mirrors components.schemas.Category (reduced to display fields). */
export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface StatusDistributionItem {
  status: TaskStatus;
  label: string;
  count: number;
}

export interface CategoryDistributionItem {
  categoryId: string;
  categoryName: string;
  count: number;
}

/** Date-only strings (YYYY-MM-DD), matching the `format: date` params. */
export interface DateRange {
  startDate: string;
  endDate: string;
}

export type ReportKind = 'completed' | 'pending';

/**
 * GET /reports/completed and GET /reports/pending define a 200 response
 * with NO content schema in the contract — the payload shape is
 * unspecified. Rather than inventing typed fields, the raw JSON is kept
 * as `unknown` and rendered generically.
 */
export type RawReportPayload = unknown;

export interface ReportsState {
  statusDistribution: StatusDistributionItem[];
  isLoadingStatusDistribution: boolean;
  statusDistributionError: string | null;

  categoryDistribution: CategoryDistributionItem[];
  isLoadingCategoryDistribution: boolean;
  categoryDistributionError: string | null;

  dateRange: DateRange;

  rawReport: RawReportPayload;
  activeReportKind: ReportKind;
  isLoadingRawReport: boolean;
  rawReportError: string | null;

  isExportingCsv: boolean;
  exportCsvError: string | null;
}
