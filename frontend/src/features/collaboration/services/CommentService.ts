import { httpClient } from '@/core/api/http-client';
import type { CursorPaginationResponse } from '@/shared/types/pagination.types';
import type { Comment, CommentInput } from '../types/comment.types';

const buildCommentsPath = (taskId: string) => `/tasks/${taskId}/comments`;

export const CommentService = {
  async getTaskComments(
    taskId: string,
    params: { limit?: number; cursor?: string } = {},
  ): Promise<CursorPaginationResponse<Comment>> {
    const { data } = await httpClient.get<CursorPaginationResponse<Comment>>(buildCommentsPath(taskId), {
      params,
    });
    return data;
  },

  async addTaskComment(taskId: string, input: CommentInput): Promise<Comment> {
    const { data } = await httpClient.post<Comment>(buildCommentsPath(taskId), input);
    return data;
  },
};
