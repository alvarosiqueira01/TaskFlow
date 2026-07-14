import { TaskProjectionRepository } from '../../domain/repositories/task-projection.repository.js';
import { MediaUploadedEventPayload } from '../../events/consumed/media-uploaded.event-schema.js';

export class ProjectMediaUploadedUseCase {
  constructor(private readonly taskProjectionRepository: TaskProjectionRepository) {}

  async execute(payload: MediaUploadedEventPayload): Promise<void> {
    const existing = await this.taskProjectionRepository.findById(payload.taskId);
    if (!existing) {
      return;
    }

    await this.taskProjectionRepository.incrementMediaCount(payload.taskId);
  }
}
