import { z } from 'zod';

export const taskAssignedEventSchema = z.object({
  taskId: z.string().uuid(),
  taskTitle: z.string(),
  assignedUserId: z.string().uuid(),
  assignedBy: z.string().uuid(),
  assignedAt: z.string().datetime(),
});

export type TaskAssignedEventPayload = z.infer<typeof taskAssignedEventSchema>;
