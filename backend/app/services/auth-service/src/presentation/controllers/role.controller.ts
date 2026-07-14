import type { FastifyReply, FastifyRequest } from 'fastify';
import { RoleMapper } from '../../contracts/mappers/role.mapper';
import type { RoleResponse } from '../../contracts/responses/role.response';
import type { UpdateUserRolesRequest } from '../../contracts/requests/update-user-roles.request';
import type { ListRolesUseCase } from '../../application/use-cases/list-roles.use-case';
import type { GetUserRolesUseCase } from '../../application/use-cases/get-user-roles.use-case';
import type { UpdateUserRolesUseCase } from '../../application/use-cases/update-user-roles.use-case';

export class RoleController {
  constructor(
    private readonly listRolesUseCase: ListRolesUseCase,
    private readonly getUserRolesUseCase: GetUserRolesUseCase,
    private readonly updateUserRolesUseCase: UpdateUserRolesUseCase,
  ) {}

  listRoles = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const roles = await this.listRolesUseCase.execute();
    const body: RoleResponse[] = roles.map((role) => RoleMapper.toResponse(role));
    reply.status(200).send(body);
  };

  getUserRoles = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ): Promise<void> => {
    const roles = await this.getUserRolesUseCase.execute(request.params.id);
    const body: RoleResponse[] = roles.map((role) => RoleMapper.toResponse(role));
    reply.status(200).send(body);
  };

  updateUserRoles = async (
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateUserRolesRequest }>,
    reply: FastifyReply,
  ): Promise<void> => {
    const roles = await this.updateUserRolesUseCase.execute({
      userId: request.params.id,
      roleIds: request.body.roleIds,
      correlationId: request.correlationId,
    });

    const body: RoleResponse[] = roles.map((role) => RoleMapper.toResponse(role));
    reply.status(200).send(body);
  };
}
