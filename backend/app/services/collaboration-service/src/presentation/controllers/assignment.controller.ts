import { FastifyReply } from 'fastify';
import { AuthenticatedRequest } from '../middleware/authenticate.middleware.js';
import { AssignUserToTaskUseCase } from '../../application/use-cases/assign-user-to-task.use-case.js';
import { RemoveTaskAssignmentUseCase } from '../../application/use-cases/remove-task-assignment.use-case.js';
import { GetTaskAssignmentsUseCase } from '../../application/use-cases/get-task-assignments.use-case.js';
import { AssignmentMapper } from '../../contracts/mappers/assignment.mapper.js';
import { HTTP_STATUS } from '../../config/constants.js';

export class AssignmentController {
  constructor(
    private readonly assignUserToTaskUseCase: AssignUserToTaskUseCase,
    private readonly removeTaskAssignmentUseCase: RemoveTaskAssignmentUseCase,
    private readonly getTaskAssignmentsUseCase: GetTaskAssignmentsUseCase,
  ) {}

  async list(request: AuthenticatedRequest, reply: FastifyReply): Promise<void> {
    const { id: taskId } = request.params as { id: string };
    const users = await this.getTaskAssignmentsUseCase.execute({ taskId });
    await reply.status(HTTP_STATUS.OK).send(users.map((user) => AssignmentMapper.toAssignedUserResponse(user)));
  }

  async assign(request: AuthenticatedRequest, reply: FastifyReply): Promise<void> {
    const { id: taskId } = request.params as { id: string };
    const { userId } = request.body as { userId: string };
    const user = request.user!;

    await this.assignUserToTaskUseCase.execute({
      taskId,
      userId,
      requesterId: user.id,
      requesterRoles: user.roles,
    });

    await reply.status(HTTP_STATUS.CREATED).send();
  }

  async remove(request: AuthenticatedRequest, reply: FastifyReply): Promise<void> {
    const { id: taskId, userId } = request.params as { id: string; userId: string };
    const user = request.user!;

    await this.removeTaskAssignmentUseCase.execute({
      taskId,
      userId,
      requesterId: user.id,
      requesterRoles: user.roles,
    });

    await reply.status(HTTP_STATUS.NO_CONTENT).send();
  }
}
