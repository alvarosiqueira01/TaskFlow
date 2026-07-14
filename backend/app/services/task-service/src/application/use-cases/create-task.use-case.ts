import { Task } from '../../domain/entities/task.entity';
import { TaskRepository } from '../../domain/repositories/task.repository';
import { EventPublisher } from '../../domain/events/event-publisher';
import { TaskCreatedEvent } from '../../domain/events/task-created.event';
import { TaskCompletedEvent } from '../../domain/events/task-completed.event';
import { TaskDto } from '../../contracts/dto/task.dto';
import { TaskMapper } from '../../contracts/mappers/task.mapper';
import { CreateTaskRequest } from '../../contracts/requests/create-task.request';

export interface CreateTaskCommand {
  requesterId: string;
  data: CreateTaskRequest;
}

export class CreateTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateTaskCommand): Promise<TaskDto> {
    const task = Task.create({
      ownerId: command.requesterId,
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

    const primitives = task.toPrimitives();

    await this.eventPublisher.publish(
      new TaskCreatedEvent({
        taskId: primitives.id,
        ownerId: primitives.ownerId,
        title: primitives.title,
        status: primitives.status,
        priority: primitives.priority,
        categoryId: primitives.categoryId,
      }),
    );

    if (task.getStatus().isCompleted()) {
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
