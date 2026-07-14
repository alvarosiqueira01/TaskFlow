import { z } from 'zod';

export const commentCreatedEventSchema = z.object({
  commentId: z.string().uuid(),
  taskId: z.string().uuid(),
  userId: z.string().uuid(),
  content: z.string(),
  parentCommentId: z.string().uuid().nullable(),
  createdAt: z.string().datetime(),
});

export type CommentCreatedEventPayload = z.infer<typeof commentCreatedEventSchema>;
