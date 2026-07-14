import type { z } from 'zod';
import type { loginBodySchema } from '../../schemas/login.schema';

export type LoginRequest = z.infer<typeof loginBodySchema>;
