import type { User } from '@/features/users/types/user.types';

export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type TaskVisibility = 'PRIVATE' | 'SHARED';

export interface TaskInput {
  title: string;
  description?: string;
  categoryId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  visibility?: TaskVisibility;
  dueDate?: string;
  archived?: boolean;
}

export interface Task extends TaskInput {
  id: string;
  ownerId: string;
  assignedUsers?: User[];
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskSortField = 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'status';
export type SortOrder = 'asc' | 'desc';

export interface TaskListParams {
  q?: string;
  limit?: number;
  cursor?: string;
  sortBy?: TaskSortField;
  sortOrder?: SortOrder;
  status?: TaskStatus;
  priority?: TaskPriority;
  categoryId?: string;
}
