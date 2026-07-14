<script setup lang="ts">
/**
 * shared/components/Breadcrumb.vue
 *
 * Breadcrumb trail for the Top Bar region described in
 * `taskflow-screens-visual-description.md` section 1 ("Top Bar...
 * contains breadcrumb navigation"). The last item is rendered as
 * plain (non-clickable) text representing the current page.
 */
import { ChevronRight } from 'lucide-vue-next';
import type { RouteLocationRaw } from 'vue-router';

export interface BreadcrumbItem {
  label: string;
  to?: RouteLocationRaw;
}

interface Props {
  items: BreadcrumbItem[];
}

defineProps<Props>();
</script>

<template>
  <nav aria-label="Breadcrumb">
    <ol class="flex items-center gap-1.5 text-sm">
      <li v-for="(item, index) in items" :key="item.label" class="flex items-center gap-1.5">
        <router-link
          v-if="item.to && index !== items.length - 1"
          :to="item.to"
          class="text-slate-500 hover:text-slate-900 hover:underline"
        >
          {{ item.label }}
        </router-link>
        <span v-else class="font-medium text-slate-900" aria-current="page">
          {{ item.label }}
        </span>
        <ChevronRight v-if="index !== items.length - 1" class="h-3.5 w-3.5 text-slate-300" aria-hidden="true" />
      </li>
    </ol>
  </nav>
</template>
