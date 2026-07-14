<script setup lang="ts">
/**
 * shared/components/LoadingSkeleton.vue
 *
 * "Never display blank pages" — `UI-UX-guidelines.md` section 13.
 * Generic skeleton block; feature components compose several of
 * these into a shape resembling the eventual content (e.g. a row of
 * three skeletons for a KPI card, a tall one for a chart container).
 */
interface Props {
  /** Tailwind height utility, e.g. `h-4`, `h-24`. */
  width?: string;
  rounded?: 'md' | 'lg' | 'full';
}

withDefaults(defineProps<Props>(), {
  height: 'h-4',
  width: 'w-full',
  rounded: 'md',
});

const roundedClasses: Record<NonNullable<Props['rounded']>, string> = {
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};
</script>

<template>
  <div
    class="animate-pulse bg-slate-200"
    :class="[width, roundedClasses[rounded]]"
    aria-hidden="true"
  />
</template>
