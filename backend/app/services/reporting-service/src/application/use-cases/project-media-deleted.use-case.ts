import { TaskProjectionRepository } from '../../domain/repositories/task-projection.repository.js';
import { MediaDeletedEventPayload } from '../../events/consumed/media-deleted.event-schema.js';

export class ProjectMediaDeletedUseCase {
  constructor(private readonly taskProjectionRepository: TaskProjectionRepository) {}

  async execute(payload: MediaDeletedEventPayload): Promise<void> {
    const existing = await this.taskProjectionRepository.findById(payload.taskId);
    if (!existing) {
      return;
    }

    await this.taskProjectionRepository.decrementMediaCount(payload.taskId);
  }
}
