import { z } from 'zod';
import { uuidSchema } from '@backend/shared';

export const updateUserRolesBodySchema = z.object({
  roleIds: z.array(uuidSchema).min(1, 'At least one role must be provided'),
});

export const userIdParamSchema = z.object({
  id: uuidSchema,
});
