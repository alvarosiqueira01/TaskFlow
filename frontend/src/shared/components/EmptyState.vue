<script setup lang="ts">
/**
 * shared/components/EmptyState.vue
 *
 * "An empty screen is an invitation to act" (frontend-design skill).
 * Used whenever a list/table/grid has no items — empty task board
 * column, no categories yet, no notifications, no search results.
 */
import { Inbox, type LucideIcon } from 'lucide-vue-next';

interface Props {
  title: string;
  description?: string;
  icon?: LucideIcon;
}

withDefaults(defineProps<Props>(), {
  description: undefined,
  icon: () => Inbox,
});
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
    <span class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
      <component :is="icon" class="h-6 w-6" aria-hidden="true" />
    </span>
    <div class="space-y-1">
      <p class="text-sm font-semibold text-slate-900">{{ title }}</p>
      <p v-if="description" class="text-sm text-slate-500">{{ description }}</p>
    </div>
    <div v-if="$slots.action" class="mt-2">
      <slot name="action" />
    </div>
  </div>
</template>
