import { buildValidationMiddleware } from '@backend/shared';
import { updateUserRolesBodySchema, userIdParamSchema } from '../../schemas/update-user-roles.schema';

export const userIdParamValidator = buildValidationMiddleware({ params: userIdParamSchema });
export const updateUserRolesValidator = buildValidationMiddleware({
  params: userIdParamSchema,
  body: updateUserRolesBodySchema,
});
