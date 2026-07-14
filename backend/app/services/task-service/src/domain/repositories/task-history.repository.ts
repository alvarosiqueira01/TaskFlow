import { PaginatedResult, PaginationOptions } from './task.repository';

export interface TaskHistoryEntry {
  id: string;
  taskId: string;
  userId: string;
  action: string;
  fieldName?: string;
  oldValue?: string;
  newValue?: string;
  createdAt: Date;
}

export interface TaskHistoryRepository {
  append(entry: TaskHistoryEntry): Promise<void>;
  appendMany(entries: TaskHistoryEntry[]): Promise<void>;
  findByTaskId(taskId: string, pagination: PaginationOptions): Promise<PaginatedResult<TaskHistoryEntry>>;
}
