import { z } from 'zod';
import { emailSchema } from '@backend/shared';

export const loginBodySchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'password is required'),
});
