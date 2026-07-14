<script setup lang="ts">
import { computed, ref } from 'vue';
import BaseButton from '@/shared/components/BaseButton.vue';
import MediaUploadProgress from './MediaUploadProgress.vue';
import { useMediaUpload } from '../composables/useMediaUpload';
import { ACCEPTED_MEDIA_INPUT_ACCEPT } from '../constants/upload';
import type { MediaAttachment } from '../types/media.types';

const props = defineProps<{ taskId: string }>();
const emit = defineEmits<{ (e: 'uploaded', attachment: MediaAttachment): void }>();

const { status, progress, error, uploadFile, reset } = useMediaUpload();
const fileInput = ref<HTMLInputElement | null>(null);

const isBusy = computed(
  () => status.value === 'requesting-url' || status.value === 'uploading' || status.value === 'confirming',
);

const statusLabel: Record<string, string> = {
  'requesting-url': 'Preparing upload...',
  uploading: 'Uploading...',
  confirming: 'Finalizing...',
};

function triggerFileSelect() {
  fileInput.value?.click();
}

async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  try {
    const attachment = await uploadFile(props.taskId, file);
    emit('uploaded', attachment);
    reset();
  } catch {
    // error is already reflected via the composable's `error` ref
  } finally {
    target.value = '';
  }
}
</script>

<template>
  <div class="media-uploader">
    <input
      ref="fileInput"
      type="file"
      :accept="ACCEPTED_MEDIA_INPUT_ACCEPT"
      class="media-uploader__input"
      @change="handleFileChange"
    />

    <BaseButton variant="secondary" :loading="isBusy" @click="triggerFileSelect">Attach video or audio</BaseButton>

    <MediaUploadProgress v-if="status === 'uploading'" :progress="progress" :label="statusLabel[status]" />
    <p v-else-if="status === 'requesting-url' || status === 'confirming'" class="media-uploader__status">
      {{ statusLabel[status] }}
    </p>

    <p v-if="error" class="media-uploader__error">{{ error }}</p>
  </div>
</template>

<style scoped>
.media-uploader {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.media-uploader__input {
  display: none;
}
.media-uploader__status,
.media-uploader__error {
  font-size: 12px;
}
.media-uploader__error {
  color: var(--color-error, #dc2626);
}
</style>
