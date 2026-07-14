<script setup lang="ts">
import type { PriorityBreakdownItem } from '../types/dashboard.types';

defineProps<{
  items: PriorityBreakdownItem[];
  loading: boolean;
  error: string | null;
}>();

defineEmits<{
  (e: 'retry'): void;
}>();

const priorityToneMap: Record<PriorityBreakdownItem['priority'], string> = {
  CRITICAL: 'danger',
  HIGH: 'warning',
  MEDIUM: 'primary',
  LOW: 'neutral',
};
</script>

<template>
  <section class="priority-mix" aria-label="Task priority distribution">
    <header class="priority-mix__header">
      <h3>Priority Mix</h3>
    </header>

    <div v-if="error" class="priority-mix__error" role="alert">
      <p>{{ error }}</p>
      <button type="button" @click="$emit('retry')">Try again</button>
    </div>

    <ul v-else class="priority-mix__list">
      <li v-for="item in items" :key="item.priority" class="priority-mix__row">
        <span
          class="priority-mix__dot"
          :class="`priority-mix__dot--${priorityToneMap[item.priority]}`"
          aria-hidden="true"
        />
        <span class="priority-mix__label">{{ item.label }}</span>
        <span class="priority-mix__count">{{ loading ? '…' : item.count }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.priority-mix {
  padding: 24px;
  border-radius: 12px;
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e5e7eb);
}

.priority-mix__header h3 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text, #111827);
}

.priority-mix__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.priority-mix__row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.priority-mix__dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  flex-shrink: 0;
}

.priority-mix__dot--danger {
  background: var(--color-danger-500, #ef4444);
}

.priority-mix__dot--warning {
  background: var(--color-warning-500, #f59e0b);
}

.priority-mix__dot--primary {
  background: var(--color-primary-500, #3b82f6);
}

.priority-mix__dot--neutral {
  background: var(--color-neutral-400, #9ca3af);
}

.priority-mix__label {
  flex: 1;
  font-size: 13px;
  color: var(--color-text-muted, #6b7280);
}

.priority-mix__count {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text, #111827);
}

.priority-mix__error {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--color-danger-50, #fef2f2);
  color: var(--color-danger-700, #b91c1c);
}

.priority-mix__error button {
  border: none;
  background: transparent;
  color: inherit;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}
</style>
