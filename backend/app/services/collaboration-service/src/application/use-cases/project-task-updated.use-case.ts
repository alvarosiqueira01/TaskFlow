import { TaskReference } from '../../domain/entities/task-reference.entity.js';
import { TaskReferenceRepository } from '../../domain/repositories/task-reference.repository.js';
import { TaskUpdatedEventPayload } from '../../events/consumed/task-updated.event-schema.js';

export class ProjectTaskUpdatedUseCase {
  constructor(private readonly taskReferenceRepository: TaskReferenceRepository) {}

  async execute(payload: TaskUpdatedEventPayload): Promise<void> {
    const existing = await this.taskReferenceRepository.findById(payload.taskId);

    const taskReference = TaskReference.create({
      id: payload.taskId,
      ownerId: payload.ownerId ?? existing?.ownerId ?? '',
      title: payload.title ?? existing?.title ?? '',
      status: payload.status ?? existing?.status ?? 'BACKLOG',
      updatedAt: new Date(payload.updatedAt),
    });

    await this.taskReferenceRepository.upsert(taskReference);
  }
}
