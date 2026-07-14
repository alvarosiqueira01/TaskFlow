import { z } from 'zod';

export const changePasswordBodySchema = z.object({
  currentPassword: z.string().min(1, 'currentPassword is required'),
  newPassword: z.string().min(8, 'newPassword must have at least 8 characters'),
});
