import { buildValidationMiddleware } from '@backend/shared';
import { registerUserBodySchema } from '../../schemas/register-user.schema';
import { loginBodySchema } from '../../schemas/login.schema';
import { passwordRecoveryBodySchema } from '../../schemas/password-recovery.schema';
import { passwordResetBodySchema } from '../../schemas/password-reset.schema';

export const registerUserValidator = buildValidationMiddleware({ body: registerUserBodySchema });
export const loginValidator = buildValidationMiddleware({ body: loginBodySchema });
export const requestPasswordRecoveryValidator = buildValidationMiddleware({ body: passwordRecoveryBodySchema });
export const resetPasswordValidator = buildValidationMiddleware({ body: passwordResetBodySchema });
