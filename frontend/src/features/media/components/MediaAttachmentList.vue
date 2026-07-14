<script setup lang="ts">
import EmptyState from '@/shared/components/EmptyState.vue';
import MediaUploader from './MediaUploader.vue';
import MediaAttachmentItem from './MediaAttachmentItem.vue';
import { useTaskAttachments } from '../composables/useTaskAttachments';
import type { MediaAttachment } from '../types/media.types';

/**
 * Public embeddable entry point for the Media feature. Owning features
 * (e.g. `tasks`) should import this rather than reaching into internal
 * composables/components — the feature has no pages/routes of its own,
 * since attachments only ever appear embedded inside Task Details.
 */
const props = defineProps<{ taskId: string; initialAttachments?: MediaAttachment[] }>();

const { attachments, error, addAttachment, replaceAttachment, removeAttachment } = useTaskAttachments(
  props.taskId,
  props.initialAttachments ?? [],
);
</script>

<template>
  <section class="media-attachment-list">
    <header class="media-attachment-list__header">
      <h4 class="media-attachment-list__title">Attachments</h4>
      <MediaUploader :task-id="taskId" @uploaded="addAttachment" />
    </header>

    <EmptyState
      v-if="!attachments.length"
      title="No attachments yet"
      description="Attach a video or audio recording to this task."
    />

    <ul v-else class="media-attachment-list__items">
      <MediaAttachmentItem
        v-for="attachment in attachments"
        :key="attachment.id"
        :attachment="attachment"
        :task-id="taskId"
        @replaced="replaceAttachment"
        @remove="removeAttachment"
      />
    </ul>

    <p v-if="error" class="media-attachment-list__error">{{ error }}</p>
  </section>
</template>

<style scoped>
.media-attachment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.media-attachment-list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.media-attachment-list__title {
  font-size: 13px;
  font-weight: 600;
  margin: 0;
}
.media-attachment-list__items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.media-attachment-list__error {
  font-size: 12px;
  color: var(--color-error, #dc2626);
}
</style>
