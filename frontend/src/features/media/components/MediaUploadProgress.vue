<script setup lang="ts">
defineProps<{ progress: number; label?: string }>();
</script>

<template>
  <div class="media-upload-progress">
    <div class="media-upload-progress__track">
      <div class="media-upload-progress__bar" :style="{ width: `${progress}%` }" />
    </div>
    <span class="media-upload-progress__label">{{ label ?? `${progress}%` }}</span>
  </div>
</template>

<style scoped>
.media-upload-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}
.media-upload-progress__track {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: var(--color-surface-subtle, #e5e7eb);
  overflow: hidden;
}
.media-upload-progress__bar {
  height: 100%;
  background: var(--color-primary, #2563eb);
  transition: width 0.2s ease;
}
.media-upload-progress__label {
  font-size: 11px;
  color: var(--color-text-secondary, #6b7280);
  min-width: 32px;
  text-align: right;
}
</style>
