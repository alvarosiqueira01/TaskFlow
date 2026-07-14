import { z } from 'zod';
import { TASK_STATUS_VALUES } from '../domain/value-objects/task-status.value-object';
import { TASK_PRIORITY_VALUES } from '../domain/value-objects/task-priority.value-object';
import { TASK_VISIBILITY_VALUES } from '../domain/value-objects/task-visibility.value-object';

export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  status: z.enum(TASK_STATUS_VALUES).optional(),
  priority: z.enum(TASK_PRIORITY_VALUES).optional(),
  visibility: z.enum(TASK_VISIBILITY_VALUES).optional(),
  dueDate: z.string().datetime().optional(),
  archived: z.boolean().optional(),
});

export type CreateTaskSchemaType = z.infer<typeof createTaskSchema>;
