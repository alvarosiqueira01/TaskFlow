import { z } from 'zod';

export const categoryCreatedEventSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string(),
  createdBy: z.string().uuid(),
  createdAt: z.string().datetime(),
});

export type CategoryCreatedEventPayload = z.infer<typeof categoryCreatedEventSchema>;
