import { TaskRepository } from '../../domain/repositories/task.repository';
import { TaskNotFoundError } from '../../domain/errors/task-not-found.error';
import { TaskDto } from '../../contracts/dto/task.dto';
import { TaskMapper } from '../../contracts/mappers/task.mapper';

export interface GetTaskCommand {
  taskId: string;
  requesterId: string;
  requesterRoles: string[];
}

export class GetTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(command: GetTaskCommand): Promise<TaskDto> {
    const task = await this.taskRepository.findById(command.taskId);
    if (!task) {
      throw new TaskNotFoundError(command.taskId);
    }

    task.ensureCanBeViewedBy(command.requesterId, command.requesterRoles);

    return TaskMapper.toDto(task);
  }
}
