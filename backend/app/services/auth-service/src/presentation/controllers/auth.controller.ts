import type { FastifyReply, FastifyRequest } from 'fastify';
import { UserMapper } from '../../contracts/mappers/user.mapper';
import type { AuthResponse } from '../../contracts/responses/auth.response';
import type { RegisterUserRequest } from '../../contracts/requests/register-user.request';
import type { LoginRequest } from '../../contracts/requests/login.request';
import type { PasswordRecoveryRequest } from '../../contracts/requests/password-recovery.request';
import type { PasswordResetRequest } from '../../contracts/requests/password-reset.request';
import type { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import type { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import type { RequestPasswordRecoveryUseCase } from '../../application/use-cases/request-password-recovery.use-case';
import type { ResetPasswordUseCase } from '../../application/use-cases/reset-password.use-case';

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly requestPasswordRecoveryUseCase: RequestPasswordRecoveryUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  register = async (
    request: FastifyRequest<{ Body: RegisterUserRequest }>,
    reply: FastifyReply,
  ): Promise<void> => {
    const result = await this.registerUserUseCase.execute({
      ...request.body,
      correlationId: request.correlationId,
    });

    const body: AuthResponse = {
      accessToken: result.accessToken,
      user: UserMapper.toResponse(result.user),
    };

    reply.status(201).send(body);
  };

  login = async (request: FastifyRequest<{ Body: LoginRequest }>, reply: FastifyReply): Promise<void> => {
    const result = await this.loginUserUseCase.execute(request.body);

    const body: AuthResponse = {
      accessToken: result.accessToken,
      user: UserMapper.toResponse(result.user),
    };

    reply.status(200).send(body);
  };

  requestPasswordRecovery = async (
    request: FastifyRequest<{ Body: PasswordRecoveryRequest }>,
    reply: FastifyReply,
  ): Promise<void> => {
    await this.requestPasswordRecoveryUseCase.execute(request.body);
    reply.status(202).send();
  };

  resetPassword = async (
    request: FastifyRequest<{ Body: PasswordResetRequest }>,
    reply: FastifyReply,
  ): Promise<void> => {
    await this.resetPasswordUseCase.execute({ ...request.body, correlationId: request.correlationId });
    reply.status(200).send();
  };
}
