<script setup lang="ts">
/**
 * shared/components/BaseCard.vue
 *
 * Generic surface container per `UI-UX-guidelines.md` section 18
 * ("Cards should be used for: Tasks, Categories, Reports, Dashboard
 * widgets"). Feature components (`TaskCard`, dashboard KPI cards, ...)
 * should wrap this rather than reimplementing the surface styling.
 */
interface Props {
  /** Removes the default padding, for cards that manage their own internal layout (e.g. tables). */
  noPadding?: boolean;
  /** Adds a hover elevation, for cards that act as clickable/navigable rows. */
  interactive?: boolean;
}

withDefaults(defineProps<Props>(), {
  noPadding: false,
  interactive: false,
});
</script>

<template>
  <div
    class="rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow duration-200"
    :class="[noPadding ? '' : 'p-6', interactive ? 'hover:shadow-md cursor-pointer' : '']"
  >
    <div v-if="$slots.header" class="mb-4 flex items-center justify-between">
      <slot name="header" />
    </div>

    <slot />

    <div v-if="$slots.footer" class="mt-4 border-t border-slate-100 pt-4">
      <slot name="footer" />
    </div>
  </div>
</template>
