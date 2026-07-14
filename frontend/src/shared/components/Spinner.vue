<script setup lang="ts">
/**
 * shared/components/Spinner.vue
 *
 * Circular loading indicator per `UI-UX-guidelines.md` section 13.
 * Used inline within buttons (via `BaseButton`'s own icon), and
 * standalone for section/page-level loading (e.g. while a streaming
 * URL is being requested).
 */
import { Loader2 } from 'lucide-vue-next';
import type { ComponentSize } from '../types/common.types';

interface Props {
  size?: ComponentSize;
  label?: string;
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  label: 'Loading…',
});

const sizeClasses: Record<ComponentSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};
</script>

<template>
  <span class="inline-flex items-center gap-2 text-slate-500" role="status">
    <Loader2 class="animate-spin" :class="sizeClasses[size]" aria-hidden="true" />
    <span class="sr-only">{{ label }}</span>
  </span>
</template>
