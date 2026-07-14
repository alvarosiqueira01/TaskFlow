<script setup lang="ts">
import LoadingSkeleton from '@/shared/components/LoadingSkeleton.vue';
import { useMediaStream } from '../composables/useMediaStream';
import type { MediaAttachment } from '../types/media.types';

const props = defineProps<{ attachment: MediaAttachment }>();
const { streamUrl, isLoading, error, hasRequested, requestStream } = useMediaStream();

function play() {
  requestStream(props.attachment.id);
}
</script>

<template>
  <div class="media-player">
    <div v-if="!hasRequested" class="media-player__placeholder" @click="play">
      <LoadingSkeleton v-if="isLoading" size="sm" />
      <span v-else>▶ Play {{ attachment.originalFilename }}</span>
    </div>

    <video
      v-else-if="streamUrl && attachment.mediaType === 'VIDEO'"
      :src="streamUrl"
      controls
      preload="none"
      class="media-player__video"
    />

    <audio v-else-if="streamUrl && attachment.mediaType === 'AUDIO'" :src="streamUrl" controls class="media-player__audio" />

    <p v-if="error" class="media-player__error">{{ error }}</p>
  </div>
</template>

<style scoped>
.media-player {
  border-radius: 8px;
  overflow: hidden;
  background: var(--color-surface-subtle, #f3f4f6);
}
.media-player__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 180px;
  cursor: pointer;
  font-size: 13px;
  color: var(--color-text-secondary, #6b7280);
}
.media-player__video {
  width: 100%;
  max-height: 320px;
}
.media-player__audio {
  width: 100%;
}
.media-player__error {
  font-size: 12px;
  color: var(--color-error, #dc2626);
  padding: 8px;
}
</style>
