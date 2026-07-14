import { z } from 'zod';

export const mentionCreatedEventSchema = z.object({
  commentId: z.string().uuid(),
  taskId: z.string().uuid(),
  mentionedUserId: z.string().uuid(),
  mentionedBy: z.string().uuid(),
  createdAt: z.string().datetime(),
});

export type MentionCreatedEventPayload = z.infer<typeof mentionCreatedEventSchema>;
