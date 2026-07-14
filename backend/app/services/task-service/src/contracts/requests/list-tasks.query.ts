import { SortOrder, TaskSortField } from '../../domain/repositories/task.repository';

export interface ListTasksQuery {
  q?: string;
  limit: number;
  cursor?: string;
  sortBy: TaskSortField;
  sortOrder: SortOrder;
  status?: string;
  priority?: string;
  categoryId?: string;
}

export interface HistoryQuery {
  limit: number;
  cursor?: string;
}
