<script setup lang="ts">
/**
 * shared/components/PageContainer.vue
 *
 * Consistent max-width and vertical rhythm for the content a feature
 * page renders inside `<DashboardLayout>` / `<AdminLayout>`'s
 * `<router-view>`. Keeps every feature page (Tasks, Categories,
 * Reports, ...) visually aligned without each one re-deriving its own
 * spacing.
 */
interface Props {
  /** Caps content width for read-heavy pages (forms, profile); grids/boards usually want the default full width. */
  narrow?: boolean;
}

withDefaults(defineProps<Props>(), { narrow: false });
</script>

<template>
  <div class="mx-auto w-full space-y-6" :class="narrow ? 'max-w-3xl' : 'max-w-7xl'">
    <slot />
  </div>
</template>
