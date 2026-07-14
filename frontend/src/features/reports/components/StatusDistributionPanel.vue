<script setup lang="ts">
import { computed } from 'vue';
import type { StatusDistributionItem } from '../types/report.types';

const props = defineProps<{
  items: StatusDistributionItem[];
  loading: boolean;
  error: string | null;
}>();

defineEmits<{
  (e: 'retry'): void;
}>();

const maxCount = computed(() => Math.max(1, ...props.items.map((item) => item.count)));

const statusToneMap: Record<StatusDistributionItem['status'], string> = {
  BACKLOG: 'neutral',
  TODO: 'primary',
  IN_PROGRESS: 'warning',
  REVIEW: 'primary-deep',
  COMPLETED: 'success',
};
</script>

<template>
  <section class="status-distribution" aria-label="Status distribution">
    <header class="status-distribution__header">
      <h3>Status Distribution</h3>
    </header>

    <div v-if="error" class="status-distribution__error" role="alert">
      <p>{{ error }}</p>
      <button type="button" @click="$emit('retry')">Try again</button>
    </div>

    <ul v-else class="status-distribution__list">
      <li v-for="item in items" :key="item.status" class="status-distribution__row">
        <span class="status-distribution__label">{{ item.label }}</span>
        <div
          class="status-distribution__track"
          role="progressbar"
          :aria-valuenow="item.count"
          aria-valuemin="0"
          :aria-valuemax="maxCount"
          :aria-label="`${item.label}: ${item.count} tasks`"
        >
          <div
            class="status-distribution__bar"
            :class="`status-distribution__bar--${statusToneMap[item.status]}`"
            :style="{ width: loading ? '8%' : `${Math.max(4, (item.count / maxCount) * 100)}%` }"
          />
        </div>
        <span class="status-distribution__count">{{ loading ? '…' : item.count }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.status-distribution {
  padding: 24px;
  border-radius: 12px;
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e5e7eb);
}

.status-distribution__header h3 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text, #111827);
}

.status-distribution__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-distribution__row {
  display: grid;
  grid-template-columns: 100px 1fr 32px;
  align-items: center;
  gap: 12px;
}

.status-distribution__label {
  font-size: 13px;
  color: var(--color-text-muted, #6b7280);
}

.status-distribution__track {
  height: 10px;
  border-radius: 999px;
  background: var(--color-border, #e5e7eb);
  overflow: hidden;
}

.status-distribution__bar {
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s ease;
}

.status-distribution__bar--neutral {
  background: var(--color-neutral-400, #9ca3af);
}

.status-distribution__bar--primary {
  background: var(--color-primary-500, #3b82f6);
}

.status-distribution__bar--warning {
  background: var(--color-warning-500, #f59e0b);
}

.status-distribution__bar--primary-deep {
  background: var(--color-primary-700, #1d4ed8);
}

.status-distribution__bar--success {
  background: var(--color-success-500, #22c55e);
}

.status-distribution__count {
  text-align: right;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text, #111827);
}

.status-distribution__error {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--color-danger-50, #fef2f2);
  color: var(--color-danger-700, #b91c1c);
}

.status-distribution__error button {
  border: none;
  background: transparent;
  color: inherit;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}
</style>
