import { defineStore } from 'pinia';
import { CommentService } from '../services/CommentService';
import type { Comment, CommentInput } from '../types/comment.types';

interface TaskCommentsBucket {
  items: Comment[];
  nextCursor: string | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  isSubmitting: boolean;
  error: string | null;
}

interface CommentStoreState {
  buckets: Record<string, TaskCommentsBucket>;
}

function createEmptyBucket(): TaskCommentsBucket {
  return {
    items: [],
    nextCursor: null,
    isLoading: false,
    isLoadingMore: false,
    isSubmitting: false,
    error: null,
  };
}

/**
 * Comments are keyed by taskId since this store may back several
 * embedded CommentThread instances (e.g. task drawer + task details
 * page) without them clobbering each other's state.
 */
export const useCommentStore = defineStore('collaboration-comments', {
  state: (): CommentStoreState => ({ buckets: {} }),

  getters: {
    bucketFor: (state) => (taskId: string) => state.buckets[taskId] ?? createEmptyBucket(),
  },

  actions: {
    ensureBucket(taskId: string) {
      if (!this.buckets[taskId]) this.buckets[taskId] = createEmptyBucket();
      return this.buckets[taskId];
    },

    async loadComments(taskId: string) {
      const bucket = this.ensureBucket(taskId);
      bucket.isLoading = true;
      bucket.error = null;
      try {
        const response = await CommentService.getTaskComments(taskId, { limit: 20 });
        bucket.items = response.items ?? [];
        bucket.nextCursor = response.nextCursor ?? null;
      } catch {
        bucket.error = 'Failed to load comments.';
      } finally {
        bucket.isLoading = false;
      }
    },

    async loadMoreComments(taskId: string) {
      const bucket = this.ensureBucket(taskId);
      if (!bucket.nextCursor || bucket.isLoadingMore) return;
      bucket.isLoadingMore = true;
      try {
        const response = await CommentService.getTaskComments(taskId, {
          limit: 20,
          cursor: bucket.nextCursor,
        });
        bucket.items = [...bucket.items, ...(response.items ?? [])];
        bucket.nextCursor = response.nextCursor ?? null;
      } finally {
        bucket.isLoadingMore = false;
      }
    },

    async addComment(taskId: string, input: CommentInput): Promise<Comment> {
      const bucket = this.ensureBucket(taskId);
      bucket.isSubmitting = true;
      bucket.error = null;
      try {
        const created = await CommentService.addTaskComment(taskId, input);
        bucket.items = [created, ...bucket.items];
        return created;
      } catch {
        bucket.error = 'Failed to post comment.';
        throw new Error(bucket.error);
      } finally {
        bucket.isSubmitting = false;
      }
    },
  },
});
