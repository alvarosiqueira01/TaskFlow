<script setup lang="ts">
import KpiCard from './KpiCard.vue';
import type { DashboardMetrics } from '../types/dashboard.types';

defineProps<{
  metrics: DashboardMetrics | null;
  loading: boolean;
  error: string | null;
}>();

defineEmits<{
  (e: 'retry'): void;
}>();
</script>

<template>
  <section class="kpi-grid" aria-label="Key task metrics">
    <div v-if="error" class="kpi-grid__error" role="alert">
      <p>{{ error }}</p>
      <button type="button" class="kpi-grid__retry" @click="$emit('retry')">Try again</button>
    </div>

    <template v-else>
      <KpiCard label="Total Tasks" :value="metrics?.totalTasks ?? 0" tone="primary" :loading="loading" />
      <KpiCard label="Pending" :value="metrics?.pendingTasks ?? 0" tone="warning" :loading="loading" />
      <KpiCard label="Completed" :value="metrics?.completedTasks ?? 0" tone="success" :loading="loading" />
      <KpiCard label="Overdue" :value="metrics?.overdueTasks ?? 0" tone="danger" :loading="loading" />
    </template>
  </section>
</template>

<style scoped>
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.kpi-grid__error {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-radius: 12px;
  background: var(--color-danger-50, #fef2f2);
  color: var(--color-danger-700, #b91c1c);
}

.kpi-grid__retry {
  border: none;
  background: transparent;
  color: inherit;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

@media (max-width: 960px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 560px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}
</style>
