import { randomUUID } from 'node:crypto';
import { TaskRepository } from '../../domain/repositories/task.repository';
import { TaskHistoryRepository } from '../../domain/repositories/task-history.repository';
import { EventPublisher } from '../../domain/events/event-publisher';
import { TaskNotFoundError } from '../../domain/errors/task-not-found.error';
import { TaskUpdatedEvent } from '../../domain/events/task-updated.event';
import { TaskCompletedEvent } from '../../domain/events/task-completed.event';
import { TaskDto } from '../../contracts/dto/task.dto';
import { TaskMapper } from '../../contracts/mappers/task.mapper';
import { UpdateTaskRequest } from '../../contracts/requests/update-task.request';

export interface UpdateTaskCommand {
  taskId: string;
  requesterId: string;
  requesterRoles: string[];
  data: UpdateTaskRequest;
}

export class UpdateTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly taskHistoryRepository: TaskHistoryRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: UpdateTaskCommand): Promise<TaskDto> {
    const task = await this.taskRepository.findById(command.taskId);
    if (!task) {
      throw new TaskNotFoundError(command.taskId);
    }

    task.ensureCanBeModifiedBy(command.requesterId, command.requesterRoles);

    const wasCompleted = task.getStatus().isCompleted();

    const changes = task.update({
      title: command.data.title,
      description: command.data.description,
      categoryId: command.data.categoryId,
      status: command.data.status,
      priority: command.data.priority,
      visibility: command.data.visibility,
      dueDate: command.data.dueDate ? new Date(command.data.dueDate) : undefined,
      archived: command.data.archived,
    });

    await this.taskRepository.save(task);

    if (changes.length > 0) {
      const now = new Date();
      await this.taskHistoryRepository.appendMany(
        changes.map((change) => ({
          id: randomUUID(),
          taskId: task.getId(),
          userId: command.requesterId,
          action: 'FIELD_UPDATED',
          fieldName: change.fieldName,
          oldValue: change.oldValue,
          newValue: change.newValue,
          createdAt: now,
        })),
      );
    }

    const primitives = task.toPrimitives();

    await this.eventPublisher.publish(
      new TaskUpdatedEvent({
        taskId: primitives.id,
        ownerId: primitives.ownerId,
        updatedBy: command.requesterId,
        changes,
      }),
    );

    const isNowCompleted = task.getStatus().isCompleted();
    if (isNowCompleted && !wasCompleted) {
      await this.eventPublisher.publish(
        new TaskCompletedEvent({
          taskId: primitives.id,
          ownerId: primitives.ownerId,
          completedAt: (primitives.completedAt ?? primitives.updatedAt).toISOString(),
        }),
      );
    }

    return TaskMapper.toDto(task);
  }
}
