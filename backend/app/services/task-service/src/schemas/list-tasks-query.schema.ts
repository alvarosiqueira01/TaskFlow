import { z } from 'zod';
import { TASK_STATUS_VALUES } from '../domain/value-objects/task-status.value-object';
import { TASK_PRIORITY_VALUES } from '../domain/value-objects/task-priority.value-object';

const SORT_BY_VALUES = ['createdAt', 'updatedAt', 'dueDate', 'priority', 'status'] as const;
const SORT_ORDER_VALUES = ['asc', 'desc'] as const;

export const listTasksQuerySchema = z.object({
  q: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
  sortBy: z.enum(SORT_BY_VALUES).default('createdAt'),
  sortOrder: z.enum(SORT_ORDER_VALUES).default('desc'),
  status: z.enum(TASK_STATUS_VALUES).optional(),
  priority: z.enum(TASK_PRIORITY_VALUES).optional(),
  categoryId: z.string().uuid().optional(),
});

export type ListTasksQuerySchemaType = z.infer<typeof listTasksQuerySchema>;
