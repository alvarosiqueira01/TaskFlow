import { z } from 'zod';
import { emailSchema, passwordSchema } from '@backend/shared';

export const registerUserBodySchema = z.object({
  username: z.string().min(3).max(50),
  email: emailSchema.max(255),
  password: passwordSchema,
  fullName: z.string().max(150).optional(),
});
