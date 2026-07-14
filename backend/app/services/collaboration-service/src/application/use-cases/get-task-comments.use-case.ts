import { CommentPage, CommentRepository } from '../../domain/repositories/comment.repository.js';
import { TaskReferenceRepository } from '../../domain/repositories/task-reference.repository.js';
import { TaskNotFoundError } from '../../domain/exceptions/collaboration.exceptions.js';

export interface GetTaskCommentsQuery {
  taskId: string;
  limit: number;
  cursor?: string | null;
}

export class GetTaskCommentsUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly taskReferenceRepository: TaskReferenceRepository,
  ) {}

  async execute(query: GetTaskCommentsQuery): Promise<CommentPage> {
    const taskReference = await this.taskReferenceRepository.findById(query.taskId);
    if (!taskReference) {
      throw new TaskNotFoundError(query.taskId);
    }

    return this.commentRepository.findByTaskId(query.taskId, query.limit, query.cursor ?? null);
  }
}
