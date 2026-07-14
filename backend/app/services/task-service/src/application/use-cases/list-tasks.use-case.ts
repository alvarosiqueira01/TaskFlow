import { TaskRepository } from '../../domain/repositories/task.repository';
import { TaskDto } from '../../contracts/dto/task.dto';
import { TaskMapper } from '../../contracts/mappers/task.mapper';
import { CursorPaginatedResponse } from '../../contracts/responses/cursor-paginated.response';
import { ListTasksQuery } from '../../contracts/requests/list-tasks.query';

const ADMIN_ROLE = 'ADMIN';

export interface ListTasksCommand {
  requesterId: string;
  requesterRoles: string[];
  query: ListTasksQuery;
}

export class ListTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(command: ListTasksCommand): Promise<CursorPaginatedResponse<TaskDto>> {
    const isAdmin = command.requesterRoles.includes(ADMIN_ROLE);

    const result = await this.taskRepository.findMany(
      {
        ownerId: isAdmin ? undefined : command.requesterId,
        status: command.query.status,
        priority: command.query.priority,
        categoryId: command.query.categoryId,
        search: command.query.q,
      },
      {
        field: command.query.sortBy,
        order: command.query.sortOrder,
      },
      {
        limit: command.query.limit,
        cursor: command.query.cursor,
      },
    );

    return {
      items: result.items.map((task) => TaskMapper.toDto(task)),
      limit: result.limit,
      nextCursor: result.nextCursor,
    };
  }
}
