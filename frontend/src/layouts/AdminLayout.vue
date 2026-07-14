<script setup lang="ts">
/**
 * layouts/AdminLayout.vue
 *
 * Layout for `meta.layout: 'admin'` routes (Administrator actor only:
 * "Manage users", "Monitor platform", "Manage permissions", "View
 * logs", "Configure system" — PRD section 4). Route-level access is
 * already enforced by `core/router/guards/permission.guard.ts`
 * (`meta.permissions: ['MANAGE_USERS']` or similar); this layout only
 * renders the admin-specific chrome.
 */
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { ROUTE_NAMES } from '../core/constants/route-names.constants';
import { getStoredUser, clearSession } from '../core/auth/token-storage';
import type { User } from '../core/auth/types/auth.types';
import { useToast } from '../core/plugins/toast.plugin';

const { t } = useI18n();
const router = useRouter();
const toast = useToast();

const currentUser = ref<User | null>(null);

onMounted(() => {
  currentUser.value = getStoredUser();
});

// Only "Manage users" / "Manage permissions" have a route backing
// them today: `features/settings/routes.ts`'s single `'settings'`
// route renders `SettingsPage.vue`, which already combines
// `RolesCatalogList` (permissions) and the user role lookup/editor
// (users) in one screen. "View logs" and "Configure system" are real
// PRD-listed admin capabilities but no feature implements a page for
// either yet, so they're rendered disabled below rather than as
// links to a route that doesn't exist.
const adminNavItems = [
  { description: 'Manage users', to: { name: 'settings' } },
  { description: 'Manage permissions', to: { name: 'settings' } },
  { description: 'View logs', to: null },
  { description: 'Configure system', to: null },
] as const;

async function handleLogout(): Promise<void> {
  clearSession();
  toast.info(t('core.nav.logout'));
  await router.push({ name: ROUTE_NAMES.LOGIN });
}

async function exitAdminArea(): Promise<void> {
  await router.push({ name: ROUTE_NAMES.HOME });
}
</script>

<template>
  <div class="flex min-h-screen bg-slate-900 text-slate-100">
    <aside class="hidden w-64 shrink-0 border-r border-slate-800 bg-slate-950 md:flex md:flex-col">
      <div class="flex h-16 items-center border-b border-slate-800 px-6">
        <span class="text-base font-semibold tracking-tight">
          {{ t('core.nav.admin') }}
        </span>
      </div>

      <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-4 text-sm">
        <template v-for="item in adminNavItems" :key="item.description">
          <router-link
            v-if="item.to"
            :to="item.to"
            class="block rounded-md px-3 py-2 font-medium text-slate-300 hover:bg-slate-800"
            active-class="bg-slate-800 text-white"
          >
            {{ item.description }}
          </router-link>
          <span
            v-else
            class="flex items-center justify-between rounded-md px-3 py-2 font-medium text-slate-500"
            :title="`${item.description} is not implemented yet`"
          >
            {{ item.description }}
            <span class="text-[10px] uppercase tracking-wide text-slate-600">Soon</span>
          </span>
        </template>
      </nav>

      <div class="border-t border-slate-800 p-3">
        <button
          type="button"
          class="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-slate-300 hover:bg-slate-800"
          @click="exitAdminArea"
        >
          {{ t('core.common.goBack') }}
        </button>
      </div>
    </aside>

    <div class="flex min-w-0 flex-1 flex-col">
      <header class="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950 px-6">
        <span class="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
          Administration Area
        </span>

        <div class="flex items-center gap-3">
          <span class="text-sm text-slate-300">
            {{ currentUser?.fullName ?? currentUser?.username }}
          </span>
          <button
            type="button"
            class="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800"
            @click="handleLogout"
          >
            {{ t('core.nav.logout') }}
          </button>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto bg-slate-50 px-6 py-8 text-slate-900">
        <router-view />
      </main>
    </div>
  </div>
</template>