<script setup lang="ts">
/**
 * shared/components/PageHeader.vue
 *
 * Title + description + primary action(s), reused across every
 * feature page's header section: Categories ("Categories" title +
 * "New Category" button), Reports ("Export CSV"), Notifications
 * ("Notifications" title + unread count + "Mark all as read"), per
 * `taskflow-screens-visual-description.md`.
 */
interface Props {
  title: string;
  description?: string;
}

withDefaults(defineProps<Props>(), { description: undefined });
</script>

<template>
  <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight text-slate-900">{{ title }}</h1>
      <p v-if="description" class="mt-1 text-sm text-slate-500">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="flex shrink-0 items-center gap-3">
      <slot name="actions" />
    </div>
  </div>
</template>
