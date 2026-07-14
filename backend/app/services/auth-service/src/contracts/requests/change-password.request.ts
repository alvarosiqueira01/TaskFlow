import type { z } from 'zod';
import type { changePasswordBodySchema } from '../../schemas/change-password.schema';

export type ChangePasswordRequest = z.infer<typeof changePasswordBodySchema>;
