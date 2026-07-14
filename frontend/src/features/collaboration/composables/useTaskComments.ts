import { computed, onMounted } from 'vue';
import { useCommentStore } from '../store/commentStore';
import type { Comment, CommentInput, ThreadedComment } from '../types/comment.types';

function buildThread(comments: Comment[]): ThreadedComment[] {
  const byId = new Map<string, ThreadedComment>();
  comments.forEach((comment) => byId.set(comment.id, { ...comment, replies: [] }));

  const roots: ThreadedComment[] = [];
  byId.forEach((comment) => {
    if (comment.parentCommentId && byId.has(comment.parentCommentId)) {
      byId.get(comment.parentCommentId)!.replies.push(comment);
    } else {
      roots.push(comment);
    }
  });

  return roots;
}

export function useTaskComments(taskId: string, options: { autoLoad?: boolean } = {}) {
  const store = useCommentStore();

  const bucket = computed(() => store.bucketFor(taskId));
  const thread = computed(() => buildThread(bucket.value.items));

  async function loadComments() {
    await store.loadComments(taskId);
  }

  async function loadMoreComments() {
    await store.loadMoreComments(taskId);
  }

  async function postComment(input: CommentInput) {
    return store.addComment(taskId, input);
  }

  if (options.autoLoad !== false) {
    onMounted(loadComments);
  }

  return {
    thread,
    flatComments: computed(() => bucket.value.items),
    isLoading: computed(() => bucket.value.isLoading),
    isLoadingMore: computed(() => bucket.value.isLoadingMore),
    isSubmitting: computed(() => bucket.value.isSubmitting),
    hasMore: computed(() => Boolean(bucket.value.nextCursor)),
    error: computed(() => bucket.value.error),
    loadComments,
    loadMoreComments,
    postComment,
  };
}
