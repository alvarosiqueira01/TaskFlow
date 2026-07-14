import { Task } from '../entities/task.entity';

export type TaskSortField = 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'status';
export type SortOrder = 'asc' | 'desc';

export interface TaskFilter {
  ownerId?: string;
  status?: string;
  priority?: string;
  categoryId?: string;
  search?: string;
}

export interface TaskSort {
  field: TaskSortField;
  order: SortOrder;
}

export interface PaginationOptions {
  limit: number;
  cursor?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  nextCursor: string | null;
  limit: number;
}

export interface TaskRepository {
  save(task: Task): Promise<void>;
  findById(id: string): Promise<Task | null>;
  findMany(filter: TaskFilter, sort: TaskSort, pagination: PaginationOptions): Promise<PaginatedResult<Task>>;
  delete(id: string): Promise<void>;
}
