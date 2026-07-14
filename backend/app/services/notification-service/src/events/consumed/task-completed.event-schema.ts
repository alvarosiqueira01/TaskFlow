import { z } from 'zod';

export const taskCompletedEventSchema = z.object({
  taskId: z.string().uuid(),
  ownerId: z.string().uuid(),
  title: z.string(),
  completedAt: z.string().datetime(),
});

export type TaskCompletedEventPayload = z.infer<typeof taskCompletedEventSchema>;
