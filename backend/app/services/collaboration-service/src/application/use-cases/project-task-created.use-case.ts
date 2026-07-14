import { TaskReference } from '../../domain/entities/task-reference.entity.js';
import { TaskReferenceRepository } from '../../domain/repositories/task-reference.repository.js';
import { TaskCreatedEventPayload } from '../../events/consumed/task-created.event-schema.js';

/**
 * Projects the consumed TaskCreated event into the local TaskReference
 * read model used by assignment/comment authorization.
 */
export class ProjectTaskCreatedUseCase {
  constructor(private readonly taskReferenceRepository: TaskReferenceRepository) {}

  async execute(payload: TaskCreatedEventPayload): Promise<void> {
    const taskReference = TaskReference.create({
      id: payload.taskId,
      ownerId: payload.ownerId,
      title: payload.title,
      status: payload.status,
      updatedAt: new Date(payload.createdAt),
    });

    await this.taskReferenceRepository.upsert(taskReference);
  }
}
