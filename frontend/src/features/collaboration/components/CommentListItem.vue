<script setup lang="ts">
import BaseAvatar from '@/shared/components/BaseAvatar.vue';
import MentionChip from './MentionChip.vue';
import { formatRelativeTime } from '@/shared/utils/date.util';
import type { ThreadedComment } from '../types/comment.types';

defineOptions({ name: 'CommentListItem' });

defineProps<{ comment: ThreadedComment; depth?: number }>();
const emit = defineEmits<{ (e: 'reply', commentId: string): void }>();
</script>

<template>
  <li class="comment-list-item" :style="{ marginLeft: `${(depth ?? 0) * 20}px` }">
    <div class="comment-list-item__row">
      <!--
        Comment schema only exposes `userId`, not an embedded author
        object, so we render the raw ID until the contract adds one.
      -->
      <BaseAvatar :name="comment.userId" size="sm" />
      <div class="comment-list-item__body">
        <p class="comment-list-item__content">{{ comment.content }}</p>

        <div v-if="comment.mentions?.length" class="comment-list-item__mentions">
          <MentionChip v-for="userId in comment.mentions" :key="userId" :user-id="userId" />
        </div>

        <div class="comment-list-item__meta">
          <span class="comment-list-item__timestamp">{{ formatRelativeTime(comment.createdAt) }}</span>
          <button type="button" class="comment-list-item__reply" @click="emit('reply', comment.id)">
            Reply
          </button>
        </div>
      </div>
    </div>

    <ul v-if="comment.replies.length" class="comment-list-item__replies">
      <CommentListItem
        v-for="reply in comment.replies"
        :key="reply.id"
        :comment="reply"
        :depth="(depth ?? 0) + 1"
        @reply="emit('reply', $event)"
      />
    </ul>
  </li>
</template>

<style scoped>
.comment-list-item {
  list-style: none;
}

.comment-list-item__row {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.comment-list-item__body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.comment-list-item__content {
  margin: 0;
  font-size: 13px;
  white-space: pre-wrap;
}

.comment-list-item__mentions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.comment-list-item__meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  color: var(--color-text-secondary, #9ca3af);
}

.comment-list-item__reply {
  border: none;
  background: none;
  color: var(--color-primary, #2563eb);
  cursor: pointer;
  font-size: 11px;
  padding: 0;
}

.comment-list-item__replies {
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-left: 2px solid var(--color-border, #e5e7eb);
  padding-left: 12px;
}
</style>
