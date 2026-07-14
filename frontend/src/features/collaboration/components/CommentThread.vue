<script setup lang="ts">
import { ref } from 'vue';
import LoadingSkeleton from '@/shared/components/LoadingSkeleton.vue';
import BaseButton from '@/shared/components/BaseButton.vue';
import EmptyState from '@/shared/components/EmptyState.vue';
import CommentComposer from './CommentComposer.vue';
import CommentListItem from './CommentListItem.vue';
import { useTaskComments } from '../composables/useTaskComments';
import type { CommentInput } from '../types/comment.types';

/**
 * Public embeddable entry point for the Collaboration feature. This is
 * the component owning features (e.g. `tasks`) should import — the
 * feature has no pages/routes of its own, since comments only ever
 * appear embedded inside another feature's screen (Task Details).
 */
const props = defineProps<{ taskId: string }>();

const { thread, isLoading, isSubmitting, hasMore, error, loadMoreComments, postComment } = useTaskComments(
  props.taskId,
);

const replyingToCommentId = ref<string | null>(null);

function handleReply(commentId: string) {
  replyingToCommentId.value = commentId;
}

function cancelReply() {
  replyingToCommentId.value = null;
}

async function handleSubmit(payload: CommentInput) {
  await postComment(payload);
  replyingToCommentId.value = null;
}
</script>

<template>
  <section class="comment-thread">
    <h4 class="comment-thread__title">Comments</h4>

    <CommentComposer
      :is-submitting="isSubmitting"
      :replying-to-comment-id="replyingToCommentId"
      @submit="handleSubmit"
      @cancel-reply="cancelReply"
    />

    <LoadingSkeleton v-if="isLoading" size="sm" />
    <EmptyState v-else-if="!thread.length" title="No comments yet" description="Start the conversation on this task." />

    <ul v-else class="comment-thread__list">
      <CommentListItem v-for="comment in thread" :key="comment.id" :comment="comment" @reply="handleReply" />
    </ul>

    <BaseButton v-if="hasMore" variant="neutral" @click="loadMoreComments">Load more comments</BaseButton>

    <p v-if="error" class="comment-thread__error">{{ error }}</p>
  </section>
</template>

<style scoped>
.comment-thread {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-thread__title {
  font-size: 13px;
  font-weight: 600;
  margin: 0;
}

.comment-thread__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 360px;
  overflow-y: auto;
}

.comment-thread__error {
  font-size: 12px;
  color: var(--color-error, #dc2626);
}
</style>
