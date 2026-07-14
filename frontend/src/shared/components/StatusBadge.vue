<script setup lang="ts">
/**
 * shared/components/StatusBadge.vue
 *
 * Renders a `TaskStatus` (or the `archived` flag) as a labeled,
 * colored badge. Per `UI-UX-guidelines.md` section 7: "Colors should
 * never be the sole indicator of meaning" — always paired with a
 * text label and a dot, never color alone.
 */
import { computed } from 'vue';
import { ARCHIVED_VISUAL, TASK_STATUS_VISUALS, type TaskStatus } from '../types/status.types';

interface Props {
  status: TaskStatus;
  /** When `true`, overrides the status visual with the archived treatment (`Task.archived`). */
  archived?: boolean;
}

const props = withDefaults(defineProps<Props>(), { archived: false });

const visual = computed(() => (props.archived ? ARCHIVED_VISUAL : TASK_STATUS_VISUALS[props.status]));
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
    :class="[visual.bgClass, visual.textClass]"
  >
    <span class="h-1.5 w-1.5 rounded-full" :class="visual.dotClass" aria-hidden="true" />
    {{ visual.label }}
  </span>
</template>
