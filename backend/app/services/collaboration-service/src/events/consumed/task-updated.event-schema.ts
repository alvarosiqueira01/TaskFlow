import { z } from 'zod';

export const taskUpdatedEventSchema = z.object({
  taskId: z.string().uuid(),
  ownerId: z.string().uuid().optional(),
  title: z.string().optional(),
  status: z.string().optional(),
  updatedAt: z.string().datetime(),
});

export type TaskUpdatedEventPayload = z.infer<typeof taskUpdatedEventSchema>;
