<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { DateRange } from '../types/report.types';

const props = defineProps<{
  dateRange: DateRange;
  exporting: boolean;
  exportError: string | null;
}>();

const emit = defineEmits<{
  (e: 'update-range', range: DateRange): void;
  (e: 'export'): void;
}>();

const form = reactive({ ...props.dateRange });

watch(
  () => props.dateRange,
  (range) => {
    form.startDate = range.startDate;
    form.endDate = range.endDate;
  }
);

function handleApply() {
  emit('update-range', { startDate: form.startDate, endDate: form.endDate });
}
</script>

<template>
  <div class="reports-action-bar">
    <div class="reports-action-bar__range">
      <label>
        <span>From</span>
        <input v-model="form.startDate" type="date" />
      </label>
      <label>
        <span>To</span>
        <input v-model="form.endDate" type="date" />
      </label>
      <button type="button" class="reports-action-bar__apply" @click="handleApply">Apply</button>
    </div>

    <div class="reports-action-bar__export">
      <button
        type="button"
        class="reports-action-bar__export-button"
        :disabled="exporting"
        @click="$emit('export')"
      >
        {{ exporting ? 'Exporting…' : 'Export CSV' }}
      </button>
      <p v-if="exportError" class="reports-action-bar__error" role="alert">{{ exportError }}</p>
    </div>
  </div>
</template>

<style scoped>
.reports-action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.reports-action-bar__range {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.reports-action-bar__range label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-muted, #6b7280);
}

.reports-action-bar__range input {
  height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid var(--color-border, #e5e7eb);
  font-size: 13px;
  font-family: inherit;
  color: var(--color-text, #111827);
}

.reports-action-bar__apply {
  height: 36px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1px solid var(--color-border, #e5e7eb);
  background: var(--color-neutral-100, #f3f4f6);
  color: var(--color-text, #111827);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.reports-action-bar__export {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.reports-action-bar__export-button {
  height: 36px;
  padding: 0 16px;
  border-radius: 8px;
  border: none;
  background: var(--color-primary-600, #2563eb);
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.reports-action-bar__export-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.reports-action-bar__error {
  margin: 0;
  font-size: 12px;
  color: var(--color-danger-600, #dc2626);
}
</style>
