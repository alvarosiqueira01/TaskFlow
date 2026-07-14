<script setup lang="ts">
import type { MediaType } from '../types/media.types';

defineProps<{ mediaType: MediaType }>();
</script>

<template>
  <span class="media-type-icon" :aria-label="mediaType === 'VIDEO' ? 'Video attachment' : 'Audio attachment'">
    {{ mediaType === 'VIDEO' ? '🎬' : '🎵' }}
  </span>
</template>

<style scoped>
.media-type-icon {
  font-size: 14px;
  line-height: 1;
}
</style>
