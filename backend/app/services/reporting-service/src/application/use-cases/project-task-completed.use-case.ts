import { TaskProjection } from '../../domain/entities/task-projection.entity.js';
import { TaskProjectionRepository } from '../../domain/repositories/task-projection.repository.js';
import { TaskCompletedEventPayload } from '../../events/consumed/task-completed.event-schema.js';

export class ProjectTaskCompletedUseCase {
  constructor(private readonly taskProjectionRepository: TaskProjectionRepository) {}

  async execute(payload: TaskCompletedEventPayload): Promise<void> {
    const existing = await this.taskProjectionRepository.findById(payload.taskId);
    const completedAt = new Date(payload.completedAt);

    if (!existing) {
      const taskProjection = TaskProjection.create({
        id: payload.taskId,
        ownerId: payload.ownerId ?? '',
        title: payload.title ?? '',
        status: 'COMPLETED',
        createdAt: completedAt,
      });
      await this.taskProjectionRepository.upsert(taskProjection);
      return;
    }

    existing.markCompleted(completedAt);
    await this.taskProjectionRepository.upsert(existing);
  }
}
