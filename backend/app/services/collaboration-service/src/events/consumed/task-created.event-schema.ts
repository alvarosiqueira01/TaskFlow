import { z } from 'zod';

export const taskCreatedEventSchema = z.object({
  taskId: z.string().uuid(),
  ownerId: z.string().uuid(),
  title: z.string(),
  status: z.string(),
  createdAt: z.string().datetime(),
});

export type TaskCreatedEventPayload = z.infer<typeof taskCreatedEventSchema>;
