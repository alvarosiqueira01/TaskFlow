import { z } from 'zod';

export const taskCompletedEventSchema = z.object({
  taskId: z.string().uuid(),
  ownerId: z.string().uuid().optional(),
  title: z.string().optional(),
  completedAt: z.string().datetime(),
});

export type TaskCompletedEventPayload = z.infer<typeof taskCompletedEventSchema>;
