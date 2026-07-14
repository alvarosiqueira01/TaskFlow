import type { z } from 'zod';
import type { registerUserBodySchema } from '../../schemas/register-user.schema';

export type RegisterUserRequest = z.infer<typeof registerUserBodySchema>;
