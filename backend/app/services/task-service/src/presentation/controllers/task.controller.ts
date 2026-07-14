import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateTaskUseCase } from '../../application/use-cases/create-task.use-case';
import { UpdateTaskUseCase } from '../../application/use-cases/update-task.use-case';
import { DeleteTaskUseCase } from '../../application/use-cases/delete-task.use-case';
import { GetTaskUseCase } from '../../application/use-cases/get-task.use-case';
import { ListTasksUseCase } from '../../application/use-cases/list-tasks.use-case';
import { GetTaskHistoryUseCase } from '../../application/use-cases/get-task-history.use-case';
import {
  validateCreateTaskRequest,
  validateHistoryQuery,
  validateListTasksQuery,
  validateTaskIdParam,
  validateUpdateTaskRequest,
} from '../validators/task.validators';
import { AuthenticationError } from '../middleware/auth.middleware';

export interface TaskControllerDependencies {
  createTaskUseCase: CreateTaskUseCase;
  updateTaskUseCase: UpdateTaskUseCase;
  deleteTaskUseCase: DeleteTaskUseCase;
  getTaskUseCase: GetTaskUseCase;
  listTasksUseCase: ListTasksUseCase;
  getTaskHistoryUseCase: GetTaskHistoryUseCase;
}

export class TaskController {
  constructor(private readonly deps: TaskControllerDependencies) {}

  private requireUser(request: FastifyRequest) {
    if (!request.user) {
      throw new AuthenticationError();
    }
    return request.user;
  }

  list = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = this.requireUser(request);
    const query = validateListTasksQuery(request.query);

    const result = await this.deps.listTasksUseCase.execute({
      requesterId: user.id,
      requesterRoles: user.roles,
      query,
    });

    reply.code(200).send(result);
  };

  create = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = this.requireUser(request);
    const data = validateCreateTaskRequest(request.body);

    const task = await this.deps.createTaskUseCase.execute({
      requesterId: user.id,
      data,
    });

    reply.code(201).send(task);
  };

  getById = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = this.requireUser(request);
    const { id } = validateTaskIdParam(request.params);

    const task = await this.deps.getTaskUseCase.execute({
      taskId: id,
      requesterId: user.id,
      requesterRoles: user.roles,
    });

    reply.code(200).send(task);
  };

  update = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = this.requireUser(request);
    const { id } = validateTaskIdParam(request.params);
    const data = validateUpdateTaskRequest(request.body);

    const task = await this.deps.updateTaskUseCase.execute({
      taskId: id,
      requesterId: user.id,
      requesterRoles: user.roles,
      data,
    });

    reply.code(200).send(task);
  };

  remove = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = this.requireUser(request);
    const { id } = validateTaskIdParam(request.params);

    await this.deps.deleteTaskUseCase.execute({
      taskId: id,
      requesterId: user.id,
      requesterRoles: user.roles,
    });

    reply.code(204).send();
  };

  history = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = this.requireUser(request);
    const { id } = validateTaskIdParam(request.params);
    const query = validateHistoryQuery(request.query);

    const result = await this.deps.getTaskHistoryUseCase.execute({
      taskId: id,
      requesterId: user.id,
      requesterRoles: user.roles,
      query,
    });

    reply.code(200).send(result);
  };
}
