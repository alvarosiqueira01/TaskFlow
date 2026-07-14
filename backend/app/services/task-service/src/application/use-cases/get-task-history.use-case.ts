import { TaskRepository } from '../../domain/repositories/task.repository';
import { TaskHistoryRepository } from '../../domain/repositories/task-history.repository';
import { TaskNotFoundError } from '../../domain/errors/task-not-found.error';
import { TaskHistoryDto } from '../../contracts/dto/task-history.dto';
import { TaskMapper } from '../../contracts/mappers/task.mapper';
import { CursorPaginatedResponse } from '../../contracts/responses/cursor-paginated.response';
import { HistoryQuery } from '../../contracts/requests/list-tasks.query';

export interface GetTaskHistoryCommand {
  taskId: string;
  requesterId: string;
  requesterRoles: string[];
  query: HistoryQuery;
}

export class GetTaskHistoryUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly taskHistoryRepository: TaskHistoryRepository,
  ) {}

  async execute(command: GetTaskHistoryCommand): Promise<CursorPaginatedResponse<TaskHistoryDto>> {
    const task = await this.taskRepository.findById(command.taskId);
    if (!task) {
      throw new TaskNotFoundError(command.taskId);
    }

    task.ensureCanBeViewedBy(command.requesterId, command.requesterRoles);

    const result = await this.taskHistoryRepository.findByTaskId(command.taskId, {
      limit: command.query.limit,
      cursor: command.query.cursor,
    });

    return {
      items: result.items.map((entry) => TaskMapper.historyToDto(entry)),
      limit: result.limit,
      nextCursor: result.nextCursor,
    };
  }
}
