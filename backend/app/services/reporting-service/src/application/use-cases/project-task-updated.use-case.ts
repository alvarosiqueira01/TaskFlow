import { TaskProjection } from '../../domain/entities/task-projection.entity.js';
import { TaskProjectionRepository } from '../../domain/repositories/task-projection.repository.js';
import { TaskUpdatedEventPayload } from '../../events/consumed/task-updated.event-schema.js';

export class ProjectTaskUpdatedUseCase {
  constructor(private readonly taskProjectionRepository: TaskProjectionRepository) {}

  async execute(payload: TaskUpdatedEventPayload): Promise<void> {
    const existing = await this.taskProjectionRepository.findById(payload.taskId);
    const updatedAt = new Date(payload.updatedAt);

    if (!existing) {
      // Late-arriving update before the corresponding TaskCreated was
      // projected; create a minimal projection to avoid data loss.
      const taskProjection = TaskProjection.create({
        id: payload.taskId,
        ownerId: payload.ownerId ?? '',
        categoryId: payload.categoryId ?? null,
        title: payload.title ?? '',
        status: payload.status ?? 'BACKLOG',
        priority: payload.priority,
        dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
        createdAt: updatedAt,
      });
      await this.taskProjectionRepository.upsert(taskProjection);
      return;
    }

    existing.applyUpdate({
      title: payload.title,
      status: payload.status,
      priority: payload.priority,
      categoryId: payload.categoryId,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : payload.dueDate === null ? null : undefined,
      updatedAt,
    });

    await this.taskProjectionRepository.upsert(existing);
  }
}
