import type { z } from 'zod';
import type { updateProfileBodySchema } from '../../schemas/update-profile.schema';

export type UpdateProfileRequest = z.infer<typeof updateProfileBodySchema>;
