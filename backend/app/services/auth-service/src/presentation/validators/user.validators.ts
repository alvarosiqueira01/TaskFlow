import { buildValidationMiddleware } from '@backend/shared';
import { updateProfileBodySchema } from '../../schemas/update-profile.schema';
import { changePasswordBodySchema } from '../../schemas/change-password.schema';

export const updateCurrentUserValidator = buildValidationMiddleware({ body: updateProfileBodySchema });
export const changePasswordValidator = buildValidationMiddleware({ body: changePasswordBodySchema });
