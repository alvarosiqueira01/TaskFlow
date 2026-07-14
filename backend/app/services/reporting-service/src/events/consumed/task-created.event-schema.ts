import { z } from 'zod';

export const taskCreatedEventSchema = z.object({
  taskId: z.string().uuid(),
  ownerId: z.string().uuid(),
  title: z.string(),
  status: z.string(),
  priority: z.string().optional(),
  categoryId: z.string().uuid().nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  createdAt: z.string().datetime(),
});

export type TaskCreatedEventPayload = z.infer<typeof taskCreatedEventSchema>;
