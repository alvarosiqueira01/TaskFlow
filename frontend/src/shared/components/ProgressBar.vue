<script setup lang="ts">
/**
 * shared/components/ProgressBar.vue
 *
 * Determinate progress indicator. Two primary uses per the source
 * documents: media upload progress (`UI-UX-guidelines.md` section 24)
 * and category completion percentage
 * (`taskflow-screens-visual-description.md` section 4: "a progress bar
 * indicating completion status with percentage text").
 */
import { computed } from 'vue';
import { clamp } from '../utils/number.util';
import type { ComponentVariant } from '../types/common.types';

interface Props {
  /** 0-100 */
  value: number;
  variant?: Extract<ComponentVariant, 'primary' | 'success' | 'warning' | 'danger'>;
  showLabel?: boolean;
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  showLabel: false,
  label: undefined,
});

const clampedValue = computed(() => clamp(props.value, 0, 100));

const fillClasses: Record<NonNullable<Props['variant']>, string> = {
  primary: 'bg-blue-600',
  success: 'bg-green-600',
  warning: 'bg-orange-500',
  danger: 'bg-red-600',
};
</script>

<template>
  <div class="w-full">
    <div class="flex items-center justify-between">
      <span v-if="showLabel" class="text-xs font-medium text-slate-600">
        {{ label ?? `${Math.round(clampedValue)}%` }}
      </span>
    </div>
    <div
      class="h-2 w-full overflow-hidden rounded-full bg-slate-100"
      role="progressbar"
      :aria-valuenow="clampedValue"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        class="h-full rounded-full transition-all duration-200 ease-out"
        :class="fillClasses[variant]"
        :style="{ width: `${clampedValue}%` }"
      />
    </div>
  </div>
</template>
