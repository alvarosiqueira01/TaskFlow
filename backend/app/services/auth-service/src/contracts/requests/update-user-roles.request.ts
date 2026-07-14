import type { z } from 'zod';
import type { updateUserRolesBodySchema } from '../../schemas/update-user-roles.schema';

export type UpdateUserRolesRequest = z.infer<typeof updateUserRolesBodySchema>;
