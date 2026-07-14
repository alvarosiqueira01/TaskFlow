<script setup lang="ts">
import { ref } from 'vue';
import BaseInput from '@/shared/components/BaseInput.vue';
import BaseTextarea from '@/shared/components/BaseTextarea.vue';
import BaseButton from '@/shared/components/BaseButton.vue';
import MentionChip from './MentionChip.vue';
import { useMentionPicker } from '../composables/useMentionPicker';
import type { CommentInput } from '../types/comment.types';

const props = defineProps<{
  isSubmitting: boolean;
  replyingToCommentId?: string | null;
}>();

const emit = defineEmits<{
  (e: 'submit', payload: CommentInput): void;
  (e: 'cancel-reply'): void;
}>();

const content = ref('');
const newMentionId = ref('');
const { mentions, addMention, removeMention, reset: resetMentions } = useMentionPicker();

function handleAddMention() {
  if (!newMentionId.value.trim()) return;
  addMention(newMentionId.value.trim());
  newMentionId.value = '';
}

function handleSubmit() {
  const trimmed = content.value.trim();
  if (!trimmed) return;

  emit('submit', {
    content: trimmed,
    parentCommentId: props.replyingToCommentId ?? undefined,
    mentions: mentions.value.length ? mentions.value : undefined,
  });

  content.value = '';
  resetMentions();
}
</script>

<template>
  <form class="comment-composer" @submit.prevent="handleSubmit">
    <div v-if="replyingToCommentId" class="comment-composer__reply-banner">
      <span>Replying to a comment</span>
      <button type="button" class="comment-composer__cancel-reply" @click="emit('cancel-reply')">
        Cancel
      </button>
    </div>

    <BaseTextarea v-model="content" placeholder="Write a comment..." :rows="2" aria-label="Write a comment" />

    <div v-if="mentions.length" class="comment-composer__mentions">
      <MentionChip v-for="userId in mentions" :key="userId" :user-id="userId" removable @remove="removeMention" />
    </div>

    <!--
      No user directory/search endpoint exists in the API contract, so
      mentioning someone requires their UUID rather than a name search.
    -->
    <div class="comment-composer__mention-add">
      <BaseInput v-model="newMentionId" placeholder="Mention user ID (UUID)" aria-label="Mention user ID" />
      <Button type="button" variant="ghost" @click="handleAddMention">Add mention</Button>
    </div>

    <footer class="comment-composer__actions">
      <BaseButton type="submit" variant="primary" :loading="isSubmitting" :disabled="!content.trim()">
        {{ replyingToCommentId ? 'Reply' : 'Send' }}
      </BaseButton>
    </footer>
  </form>
</template>

<style scoped>
.comment-composer {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.comment-composer__reply-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--color-text-secondary, #6b7280);
  background: var(--color-surface-subtle, #f3f4f6);
  border-radius: 6px;
  padding: 6px 10px;
}

.comment-composer__cancel-reply {
  border: none;
  background: none;
  color: var(--color-primary, #2563eb);
  cursor: pointer;
  font-size: 12px;
}

.comment-composer__mentions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.comment-composer__mention-add {
  display: flex;
  gap: 8px;
}

.comment-composer__actions {
  display: flex;
  justify-content: flex-end;
}
</style>
