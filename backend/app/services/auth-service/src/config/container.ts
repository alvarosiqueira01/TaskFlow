import { createLogger, requireRoles, buildAuthMiddleware, UserRole, type EventPublisher, type Logger } from '@backend/shared';
import type { AuthServiceEnv } from './env';
import { createDrizzleClient } from '../infrastructure/database/drizzle/client';
import { DrizzleUserRepository } from '../infrastructure/repositories/drizzle-user.repository';
import { DrizzleRoleRepository } from '../infrastructure/repositories/drizzle-role.repository';
import { DrizzlePasswordResetTokenRepository } from '../infrastructure/repositories/drizzle-password-reset-token.repository';
import { JsonWebTokenService } from '../infrastructure/jwt/jsonwebtoken-token.service';
import { BcryptPasswordHasher } from '../infrastructure/jwt/bcrypt-password-hasher';
import { EventBridgePublisher } from '../infrastructure/events/eventbridge/eventbridge-publisher';
import { SesMailSender } from '../infrastructure/mail/ses-mail-sender';

import { RegisterUserUseCase } from '../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../application/use-cases/login-user.use-case';
import { RequestPasswordRecoveryUseCase } from '../application/use-cases/request-password-recovery.use-case';
import { ResetPasswordUseCase } from '../application/use-cases/reset-password.use-case';
import { GetCurrentUserUseCase } from '../application/use-cases/get-current-user.use-case';
import { UpdateCurrentUserUseCase } from '../application/use-cases/update-current-user.use-case';
import { ChangePasswordUseCase } from '../application/use-cases/change-password.use-case';
import { ListRolesUseCase } from '../application/use-cases/list-roles.use-case';
import { GetUserRolesUseCase } from '../application/use-cases/get-user-roles.use-case';
import { UpdateUserRolesUseCase } from '../application/use-cases/update-user-roles.use-case';

import { AuthController } from '../presentation/controllers/auth.controller';
import { UserController } from '../presentation/controllers/user.controller';
import { RoleController } from '../presentation/controllers/role.controller';

export interface AppContainer {
  logger: Logger;
  eventPublisher: EventPublisher;
  controllers: {
    authController: AuthController;
    userController: UserController;
    roleController: RoleController;
  };
  middleware: {
    requireAuth: ReturnType<typeof buildAuthMiddleware>;
    requireAdmin: ReturnType<typeof requireRoles>;
  };
}

/**
 * Composition Root: builds and wires every dependency for auth-service.
 * Must be the ONLY place where infrastructure implementations are
 * instantiated and injected into use cases via constructor injection.
 */
export function buildContainer(env: AuthServiceEnv): AppContainer {
  const logger = createLogger({ serviceName: env.SERVICE_NAME, level: env.LOG_LEVEL, environment: env.NODE_ENV });

  const db = createDrizzleClient(env.DATABASE_URL);

  const userRepository = new DrizzleUserRepository(db);
  const roleRepository = new DrizzleRoleRepository(db);
  const passwordResetTokenRepository = new DrizzlePasswordResetTokenRepository(db);

  const passwordHasher = new BcryptPasswordHasher(env.BCRYPT_SALT_ROUNDS);
  const tokenService = new JsonWebTokenService({
    jwtSecret: env.JWT_SECRET,
    jwtExpiresIn: env.JWT_EXPIRES_IN,
    passwordResetSecret: env.PASSWORD_RESET_SECRET,
  });

  const eventPublisher: EventPublisher = new EventBridgePublisher({
    eventBusName: env.EVENT_BUS_NAME,
    region: env.AWS_REGION,
  });

  const mailSender = new SesMailSender({ region: env.AWS_REGION, fromAddress: env.MAIL_FROM_ADDRESS });

  const registerUserUseCase = new RegisterUserUseCase(
    userRepository,
    roleRepository,
    passwordHasher,
    tokenService,
    eventPublisher,
  );
  const loginUserUseCase = new LoginUserUseCase(userRepository, passwordHasher, tokenService);
  const requestPasswordRecoveryUseCase = new RequestPasswordRecoveryUseCase(
    userRepository,
    passwordResetTokenRepository,
    tokenService,
    mailSender,
    { ttlMinutes: env.PASSWORD_RESET_TOKEN_TTL_MINUTES, appBaseUrl: env.APP_BASE_URL },
    logger,
  );
  const resetPasswordUseCase = new ResetPasswordUseCase(
    userRepository,
    passwordResetTokenRepository,
    passwordHasher,
    tokenService,
    eventPublisher,
  );
  const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);
  const updateCurrentUserUseCase = new UpdateCurrentUserUseCase(userRepository, eventPublisher);
  const changePasswordUseCase = new ChangePasswordUseCase(userRepository, passwordHasher, eventPublisher);
  const listRolesUseCase = new ListRolesUseCase(roleRepository);
  const getUserRolesUseCase = new GetUserRolesUseCase(userRepository, roleRepository);
  const updateUserRolesUseCase = new UpdateUserRolesUseCase(userRepository, roleRepository, eventPublisher);

  const authController = new AuthController(
    registerUserUseCase,
    loginUserUseCase,
    requestPasswordRecoveryUseCase,
    resetPasswordUseCase,
  );
  const userController = new UserController(getCurrentUserUseCase, updateCurrentUserUseCase, changePasswordUseCase);
  const roleController = new RoleController(listRolesUseCase, getUserRolesUseCase, updateUserRolesUseCase);

  const requireAuth = buildAuthMiddleware({ jwtSecret: env.JWT_SECRET });
  const requireAdmin = requireRoles('ADMINISTRATOR');

  return {
    logger,
    eventPublisher,
    controllers: { authController, userController, roleController },
    middleware: { requireAuth, requireAdmin },
  };
}
