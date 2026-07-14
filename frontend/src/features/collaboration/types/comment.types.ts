export interface CommentInput {
  content: string;
  parentCommentId?: string;
  mentions?: string[];
}

export interface Comment extends CommentInput {
  id: string;
  taskId: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Client-side tree projection of Comment. The API returns a flat,
 * cursor-paginated list per GET /tasks/{id}/comments; nesting by
 * `parentCommentId` is built locally (see useTaskComments).
 */
export interface ThreadedComment extends Comment {
  replies: ThreadedComment[];
}
