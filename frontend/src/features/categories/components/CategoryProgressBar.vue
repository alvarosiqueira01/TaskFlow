<script setup lang="ts">
defineProps<{ percentage: number | null }>();
</script>

<template>
  <div class="category-progress-bar">
    <div class="category-progress-bar__track">
      <div
        class="category-progress-bar__fill"
        :class="{ 'category-progress-bar__fill--unknown': percentage === null }"
        :style="{ width: `${percentage ?? 0}%` }"
      />
    </div>
    <span class="category-progress-bar__label">{{ percentage === null ? '—' : `${percentage}%` }}</span>
  </div>
</template>

<style scoped>
.category-progress-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}
.category-progress-bar__track {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: var(--color-surface-subtle, #e5e7eb);
  overflow: hidden;
}
.category-progress-bar__fill {
  height: 100%;
  background: var(--color-primary, #2563eb);
  transition: width 0.2s ease;
}
.category-progress-bar__fill--unknown {
  background: var(--color-border, #d1d5db);
}
.category-progress-bar__label {
  font-size: 11px;
  color: var(--color-text-secondary, #6b7280);
  min-width: 30px;
  text-align: right;
}
</style>
