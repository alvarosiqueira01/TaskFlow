import { TaskRepository } from '../../domain/repositories/task.repository';
import { EventPublisher } from '../../domain/events/event-publisher';
import { TaskNotFoundError } from '../../domain/errors/task-not-found.error';
import { TaskDeletedEvent } from '../../domain/events/task-deleted.event';

export interface DeleteTaskCommand {
  taskId: string;
  requesterId: string;
  requesterRoles: string[];
}

export class DeleteTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: DeleteTaskCommand): Promise<void> {
    const task = await this.taskRepository.findById(command.taskId);
    if (!task) {
      throw new TaskNotFoundError(command.taskId);
    }

    task.ensureCanBeDeletedBy(command.requesterId, command.requesterRoles);

    await this.taskRepository.delete(command.taskId);

    await this.eventPublisher.publish(
      new TaskDeletedEvent({
        taskId: task.getId(),
        ownerId: task.getOwnerId(),
        deletedBy: command.requesterId,
      }),
    );
  }
}
