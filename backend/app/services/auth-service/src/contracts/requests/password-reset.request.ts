import type { z } from 'zod';
import type { passwordResetBodySchema } from '../../schemas/password-reset.schema';

export type PasswordResetRequest = z.infer<typeof passwordResetBodySchema>;
