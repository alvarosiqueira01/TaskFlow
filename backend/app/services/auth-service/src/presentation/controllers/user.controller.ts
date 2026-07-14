import type { FastifyReply, FastifyRequest } from 'fastify';
import { UnauthorizedError } from '@backend/shared';
import { UserMapper } from '../../contracts/mappers/user.mapper';
import type { UserResponse } from '../../contracts/responses/user.response';
import type { UpdateProfileRequest } from '../../contracts/requests/update-profile.request';
import type { ChangePasswordRequest } from '../../contracts/requests/change-password.request';
import type { GetCurrentUserUseCase } from '../../application/use-cases/get-current-user.use-case';
import type { UpdateCurrentUserUseCase } from '../../application/use-cases/update-current-user.use-case';
import type { ChangePasswordUseCase } from '../../application/use-cases/change-password.use-case';

export class UserController {
  constructor(
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
    private readonly updateCurrentUserUseCase: UpdateCurrentUserUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
  ) {}

  getCurrentUser = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const userId = this.requireUserId(request);
    const user = await this.getCurrentUserUseCase.execute(userId);
    const body: UserResponse = UserMapper.toResponse(user);
    reply.status(200).send(body);
  };

  updateCurrentUser = async (
    request: FastifyRequest<{ Body: UpdateProfileRequest }>,
    reply: FastifyReply,
  ): Promise<void> => {
    const userId = this.requireUserId(request);

    const user = await this.updateCurrentUserUseCase.execute({
      userId,
      fullName: request.body.fullName,
      avatarUrl: request.body.avatarUrl,
      correlationId: request.correlationId,
    });

    const body: UserResponse = UserMapper.toResponse(user);
    reply.status(200).send(body);
  };

  changePassword = async (
    request: FastifyRequest<{ Body: ChangePasswordRequest }>,
    reply: FastifyReply,
  ): Promise<void> => {
    const userId = this.requireUserId(request);

    await this.changePasswordUseCase.execute({
      userId,
      currentPassword: request.body.currentPassword,
      newPassword: request.body.newPassword,
      correlationId: request.correlationId,
    });

    reply.status(200).send();
  };

  private requireUserId(request: FastifyRequest): string {
    if (!request.user) {
      throw new UnauthorizedError();
    }
    return request.user.id;
  }
}
