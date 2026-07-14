import { Comment } from '../../domain/entities/comment.entity.js';
import { CommentResponse } from '../dtos/comment.dto.js';

export class CommentMapper {
  static toResponse(comment: Comment): CommentResponse {
    const primitives = comment.toPrimitives();
    return {
      id: primitives.id,
      taskId: primitives.taskId,
      userId: primitives.userId,
      content: primitives.content,
      parentCommentId: primitives.parentCommentId ?? undefined,
      mentions: primitives.mentions,
      createdAt: primitives.createdAt.toISOString(),
      updatedAt: primitives.updatedAt ? primitives.updatedAt.toISOString() : undefined,
    };
  }
}
