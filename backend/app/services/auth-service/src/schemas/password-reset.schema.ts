import { z } from 'zod';

export const passwordResetBodySchema = z.object({
  token: z.string().min(1, 'token is required'),
  newPassword: z.string().min(8, 'newPassword must have at least 8 characters'),
});
