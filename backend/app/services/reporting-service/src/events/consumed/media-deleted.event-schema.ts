import { z } from 'zod';

export const mediaDeletedEventSchema = z.object({
  mediaId: z.string().uuid(),
  taskId: z.string().uuid(),
  deletedAt: z.string().datetime(),
});

export type MediaDeletedEventPayload = z.infer<typeof mediaDeletedEventSchema>;
