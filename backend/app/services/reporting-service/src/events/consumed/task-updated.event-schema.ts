import { z } from 'zod';

export const taskUpdatedEventSchema = z.object({
  taskId: z.string().uuid(),
  ownerId: z.string().uuid().optional(),
  title: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  categoryId: z.string().uuid().nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  updatedAt: z.string().datetime(),
});

export type TaskUpdatedEventPayload = z.infer<typeof taskUpdatedEventSchema>;
