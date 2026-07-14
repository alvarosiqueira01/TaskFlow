<script setup lang="ts">
/**
 * shared/components/DataCard.vue
 *
 * Generic metric/summary card, composing `BaseCard`. Covers the
 * Dashboard KPI cards ("Total Tasks", "In Progress", "Completed",
 * "Overdue" — `taskflow-screens-visual-description.md` section 2) and
 * doubles as the base for the Category grid cards (title + count +
 * progress, section 4), via the default slot for card-specific body
 * content.
 */
import { computed } from 'vue';
import type { Component } from 'vue';
import BaseCard from './BaseCard.vue';
import type { ComponentVariant } from '../types/common.types';

interface Props {
  title: string;
  /** Large headline value, e.g. a KPI count ("24"). Omit when using the default slot for custom body content instead. */
  value?: string | number;
  icon?: Component;
  variant?: Extract<ComponentVariant, 'primary' | 'success' | 'warning' | 'danger' | 'neutral'>;
}

const props = withDefaults(defineProps<Props>(), {
  value: undefined,
  icon: undefined,
  variant: 'neutral',
});

const iconClasses: Record<NonNullable<Props['variant']>, string> = {
  primary: 'bg-blue-50 text-blue-600',
  success: 'bg-green-50 text-green-600',
  warning: 'bg-orange-50 text-orange-600',
  danger: 'bg-red-50 text-red-600',
  neutral: 'bg-slate-100 text-slate-600',
};

const hasValue = computed(() => props.value !== undefined);
</script>

<template>
  <BaseCard>
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm font-medium text-slate-500">{{ title }}</p>
        <p v-if="hasValue" class="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          {{ value }}
        </p>
      </div>
      <span
        v-if="icon"
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        :class="iconClasses[variant]"
      >
        <component :is="icon" class="h-5 w-5" aria-hidden="true" />
      </span>
    </div>

    <div v-if="$slots.default" class="mt-4">
      <slot />
    </div>
  </BaseCard>
</template>
