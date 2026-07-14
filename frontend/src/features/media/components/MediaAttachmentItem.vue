<script setup lang="ts">
import { computed, ref } from 'vue';
import BaseButton from '@/shared/components/BaseButton.vue';
import MediaTypeIcon from './MediaTypeIcon.vue';
import MediaPlayer from './MediaPlayer.vue';
import MediaUploadProgress from './MediaUploadProgress.vue';
import { useMediaReplace } from '../composables/useMediaReplace';
import { ACCEPTED_MEDIA_INPUT_ACCEPT } from '../constants/upload';
import type { MediaAttachment } from '../types/media.types';

const props = defineProps<{ attachment: MediaAttachment; taskId: string }>();
const emit = defineEmits<{
  (e: 'replaced', attachment: MediaAttachment): void;
  (e: 'remove', mediaId: string): void;
}>();

const { status, progress, error, replaceFile, reset } = useMediaReplace();
const replaceInput = ref<HTMLInputElement | null>(null);

const isReplacing = computed(() => status.value === 'uploading' || status.value === 'confirming');

function triggerReplace() {
  replaceInput.value?.click();
}

async function handleReplaceFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  try {
    const updated = await replaceFile(props.attachment.id, props.taskId, file);
    emit('replaced', updated);
    reset();
  } catch {
    // error surfaced via the composable's `error` ref
  } finally {
    target.value = '';
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`;
}
</script>

<template>
  <li class="media-attachment-item">
    <MediaPlayer :attachment="attachment" />

    <div class="media-attachment-item__meta">
      <MediaTypeIcon :media-type="attachment.mediaType" />
      <span class="media-attachment-item__name">{{ attachment.originalFilename }}</span>
      <span class="media-attachment-item__size">{{ formatFileSize(attachment.fileSize) }}</span>
    </div>

    <MediaUploadProgress v-if="isReplacing" :progress="progress" label="Replacing..." />

    <div class="media-attachment-item__actions">
      <input
        ref="replaceInput"
        type="file"
        :accept="ACCEPTED_MEDIA_INPUT_ACCEPT"
        class="media-attachment-item__input"
        @change="handleReplaceFileChange"
      />
      <BaseButton variant="neutral" :loading="isReplacing" @click="triggerReplace">Replace</BaseButton>
      <BaseButton variant="neutral" @click="emit('remove', attachment.id)">Remove</BaseButton>
    </div>

    <p v-if="error" class="media-attachment-item__error">{{ error }}</p>
  </li>
</template>

<style scoped>
.media-attachment-item {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.media-attachment-item__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text-secondary, #6b7280);
}
.media-attachment-item__name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.media-attachment-item__actions {
  display: flex;
  gap: 8px;
}
.media-attachment-item__input {
  display: none;
}
.media-attachment-item__error {
  font-size: 12px;
  color: var(--color-error, #dc2626);
}
</style>
