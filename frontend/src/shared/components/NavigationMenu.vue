<script setup lang="ts">
/**
 * shared/components/NavigationMenu.vue
 *
 * Generic, data-driven navigation list. Renders an array of items as
 * router-links, highlighting the active route (per
 * `UI-UX-guidelines.md` section 5: "Current page must always be
 * visually highlighted") and hiding entries the current user lacks
 * permission for via `v-permission`.
 *
 * NOTE: `DashboardLayout.vue` / `AdminLayout.vue` (generated in the
 * `core`/`layouts` scope) currently inline their own navigation
 * markup. This component is the reusable primitive future
 * feature/layout refactors should migrate to, rather than a
 * replacement applied retroactively in this execution.
 */
import type { Component } from 'vue';
import type { RouteLocationRaw } from 'vue-router';
import type { PermissionKey } from '../../core/constants/permissions.constants';
import { vPermission } from '../directives/permission.directive';

export interface NavigationMenuItem {
  label: string;
  to: RouteLocationRaw;
  icon?: Component;
  /** Any one of these permissions is required for the item to render. Omit for items visible to every authenticated user. */
  permissions?: PermissionKey[];
}

interface Props {
  items: NavigationMenuItem[];
}

defineProps<Props>();
</script>

<template>
  <nav class="space-y-1 text-sm">
    <router-link
      v-for="item in items"
      :key="item.label"
      v-permission="item.permissions ?? []"
      :to="item.to"
      class="flex items-center gap-2.5 rounded-md px-3 py-2 font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900"
      active-class="bg-slate-100 text-slate-900"
    >
      <component :is="item.icon" v-if="item.icon" class="h-4 w-4 shrink-0" aria-hidden="true" />
      {{ item.label }}
    </router-link>
  </nav>
</template>
