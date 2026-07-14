export interface CreateCommentRequest {
  content: string;
  parentCommentId?: string;
  mentions?: string[];
}

export interface CommentResponse {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  parentCommentId?: string;
  mentions?: string[];
  createdAt: string;
  updatedAt?: string;
}
