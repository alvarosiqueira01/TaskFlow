import type { z } from 'zod';
import type { passwordRecoveryBodySchema } from '../../schemas/password-recovery.schema';

export type PasswordRecoveryRequest = z.infer<typeof passwordRecoveryBodySchema>;
