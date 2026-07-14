<script setup lang="ts">
import { computed } from 'vue';

export type KpiTone = 'primary' | 'success' | 'warning' | 'danger';

const props = withDefaults(
  defineProps<{
    label: string;
    value: number;
    tone?: KpiTone;
    loading?: boolean;
  }>(),
  {
    tone: 'primary',
    loading: false,
  }
);

const formattedValue = computed(() => new Intl.NumberFormat('en-US').format(props.value));
</script>

<template>
  <article
    class="kpi-card"
    :class="`kpi-card--${tone}`"
    role="figure"
    :aria-label="`${label}: ${formattedValue}`"
  >
    <span class="kpi-card__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12l3 3 5-6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>

    <div class="kpi-card__body">
      <p class="kpi-card__label">{{ label }}</p>
      <p v-if="!loading" class="kpi-card__value">{{ formattedValue }}</p>
      <p v-else class="kpi-card__value kpi-card__value--skeleton" aria-hidden="true">&nbsp;</p>
    </div>
  </article>
</template>

<style scoped>
.kpi-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border-radius: 12px;
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e5e7eb);
}

.kpi-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  flex-shrink: 0;
}

.kpi-card--primary .kpi-card__icon {
  color: var(--color-primary-600, #2563eb);
  background: var(--color-primary-100, #dbeafe);
}

.kpi-card--success .kpi-card__icon {
  color: var(--color-success-600, #16a34a);
  background: var(--color-success-100, #dcfce7);
}

.kpi-card--warning .kpi-card__icon {
  color: var(--color-warning-600, #d97706);
  background: var(--color-warning-100, #fef3c7);
}

.kpi-card--danger .kpi-card__icon {
  color: var(--color-danger-600, #dc2626);
  background: var(--color-danger-100, #fee2e2);
}

.kpi-card__label {
  margin: 0 0 4px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-muted, #6b7280);
}

.kpi-card__value {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text, #111827);
}

.kpi-card__value--skeleton {
  width: 48px;
  height: 24px;
  border-radius: 4px;
  background: var(--color-border, #e5e7eb);
}
</style>
