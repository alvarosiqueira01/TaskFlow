import { Comment } from '../entities/comment.entity.js';

export interface CommentPage {
  items: Comment[];
  nextCursor: string | null;
}

export interface CommentRepository {
  save(comment: Comment): Promise<void>;
  findById(commentId: string): Promise<Comment | null>;
  findByTaskId(taskId: string, limit: number, cursor?: string | null): Promise<CommentPage>;
}
