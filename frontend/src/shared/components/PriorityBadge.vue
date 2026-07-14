<script setup lang="ts">
/**
 * shared/components/PriorityBadge.vue
 *
 * Renders a `TaskPriority` as a labeled, colored badge (Low/Medium/
 * High/Critical), matching `UI-UX-guidelines.md` section 7's priority
 * color table exactly.
 */
import { computed } from 'vue';
import { TASK_PRIORITY_VISUALS, type TaskPriority } from '../types/status.types';

interface Props {
  priority: TaskPriority;
}

const props = defineProps<Props>();

const visual = computed(() => TASK_PRIORITY_VISUALS[props.priority]);
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
