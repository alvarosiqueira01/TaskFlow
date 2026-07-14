import { TaskProjectionRepository } from '../../domain/repositories/task-projection.repository.js';
import { CommentCreatedEventPayload } from '../../events/consumed/comment-created.event-schema.js';

export class ProjectCommentCreatedUseCase {
  constructor(private readonly taskProjectionRepository: TaskProjectionRepository) {}

  async execute(payload: CommentCreatedEventPayload): Promise<void> {
    const existing = await this.taskProjectionRepository.findById(payload.taskId);
    if (!existing) {
      // Projection not yet available; safely ignored — TaskCreated
      // projection will eventually be consistent, and comment counts
      // are non-critical aggregate metrics.
      return;
    }

    await this.taskProjectionRepository.incrementCommentsCount(payload.taskId);
  }
}
