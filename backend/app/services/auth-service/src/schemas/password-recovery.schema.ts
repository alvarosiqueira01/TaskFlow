import { z } from 'zod';
import { emailSchema } from '@backend/shared';

export const passwordRecoveryBodySchema = z.object({
  email: emailSchema,
});
