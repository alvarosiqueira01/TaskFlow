import { z } from 'zod';

export const commentInputSchema = z.object({
  content: z.string().min(1, 'Comment content must not be empty'),
  parentCommentId: z.string().uuid().optional(),
  mentions: z.array(z.string().uuid()).optional(),
});

export type CommentInput = z.infer<typeof commentInputSchema>;

export const taskCommentsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
});
