import { TaskProjection } from '../../domain/entities/task-projection.entity.js';
import { TaskProjectionRepository } from '../../domain/repositories/task-projection.repository.js';
import { TaskCreatedEventPayload } from '../../events/consumed/task-created.event-schema.js';

export class ProjectTaskCreatedUseCase {
  constructor(private readonly taskProjectionRepository: TaskProjectionRepository) {}

  async execute(payload: TaskCreatedEventPayload): Promise<void> {
    const taskProjection = TaskProjection.create({
      id: payload.taskId,
      ownerId: payload.ownerId,
      categoryId: payload.categoryId ?? null,
      title: payload.title,
      status: payload.status,
      priority: payload.priority,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
      createdAt: new Date(payload.createdAt),
    });

    await this.taskProjectionRepository.upsert(taskProjection);
  }
}
