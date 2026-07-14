<script setup lang="ts">
import { computed } from 'vue';
import type { ReportKind } from '../types/report.types';

const props = defineProps<{
  activeKind: ReportKind;
  data: unknown;
  loading: boolean;
  error: string | null;
}>();

defineEmits<{
  (e: 'change-kind', kind: ReportKind): void;
  (e: 'retry'): void;
}>();

const formattedData = computed(() => {
  if (props.data === null || props.data === undefined) {
    return '';
  }
  return JSON.stringify(props.data, null, 2);
});
</script>

<template>
  <section class="raw-report" aria-label="Report data">
    <header class="raw-report__header">
      <h3>Weekly Throughput</h3>
      <div class="raw-report__tabs">
        <button
          type="button"
          class="raw-report__tab"
          :class="{ 'raw-report__tab--active': activeKind === 'completed' }"
          @click="$emit('change-kind', 'completed')"
        >
          Completed
        </button>
        <button
          type="button"
          class="raw-report__tab"
          :class="{ 'raw-report__tab--active': activeKind === 'pending' }"
          @click="$emit('change-kind', 'pending')"
        >
          Pending
        </button>
      </div>
    </header>

    <p class="raw-report__hint">
      The API does not define a response schema for this report yet, so the
      raw payload is shown below rather than a chart built on guessed fields.
    </p>

    <div v-if="error" class="raw-report__error" role="alert">
      <p>{{ error }}</p>
      <button type="button" @click="$emit('retry')">Try again</button>
    </div>

    <p v-else-if="loading" class="raw-report__loading">Loading report data…</p>

    <pre v-else class="raw-report__data">{{ formattedData || 'No data returned.' }}</pre>
  </section>
</template>

<style scoped>
.raw-report {
  padding: 24px;
  border-radius: 12px;
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e5e7eb);
}

.raw-report__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 8px;
}

.raw-report__header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text, #111827);
}

.raw-report__tabs {
  display: flex;
  gap: 4px;
}

.raw-report__tab {
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--color-border, #e5e7eb);
  background: transparent;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-muted, #6b7280);
  cursor: pointer;
}

.raw-report__tab--active {
  background: var(--color-primary-100, #dbeafe);
  color: var(--color-primary-700, #1d4ed8);
  border-color: transparent;
}

.raw-report__hint {
  margin: 0 0 16px;
  font-size: 12px;
  color: var(--color-text-muted, #6b7280);
}

.raw-report__loading {
  margin: 0;
  font-size: 13px;
  color: var(--color-text-muted, #6b7280);
}

.raw-report__data {
  margin: 0;
  padding: 16px;
  border-radius: 8px;
  background: var(--color-neutral-50, #f9fafb);
  font-size: 12px;
  line-height: 1.5;
  color: var(--color-text, #111827);
  overflow-x: auto;
  max-height: 320px;
  overflow-y: auto;
}

.raw-report__error {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--color-danger-50, #fef2f2);
  color: var(--color-danger-700, #b91c1c);
}

.raw-report__error button {
  border: none;
  background: transparent;
  color: inherit;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}
</style>
