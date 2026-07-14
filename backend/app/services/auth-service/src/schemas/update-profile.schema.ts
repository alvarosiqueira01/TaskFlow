import { z } from 'zod';

export const updateProfileBodySchema = z.object({
  fullName: z.string().max(150).optional(),
  avatarUrl: z.string().url().optional(),
});
