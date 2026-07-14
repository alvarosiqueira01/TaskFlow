<script setup lang="ts">
/**
 * layouts/DashboardLayout.vue
 *
 * Primary authenticated application shell. Wraps every route with
 * `meta.layout: 'dashboard'` (Tasks, Categories, Reports,
 * Notifications, Profile, ...) in a persistent sidebar + topbar frame.
 *
 * NOTE: user/session state is read directly from `core/auth/token-storage`
 * for this execution's scope. Once the `auth` feature is generated, its
 * Pinia store (`features/auth/store`) should become the reactive source
 * of truth and this layout should consume it via composable instead of
 * re-reading storage on mount.
 */
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { ROUTE_NAMES } from '../core/constants/route-names.constants';
import { PERMISSIONS } from '../core/constants/permissions.constants';
import { getStoredUser, clearSession } from '../core/auth/token-storage';
import { hasPermission } from '../core/auth/permission-evaluator';
import type { User } from '../core/auth/types/auth.types';
import { useToast } from '../core/plugins/toast.plugin';

const { t } = useI18n();
const router = useRouter();
const toast = useToast();

const currentUser = ref<User | null>(null);
const isUserMenuOpen = ref(false);

onMounted(() => {
  currentUser.value = getStoredUser();
});

const canViewDashboards = computed(() =>
  hasPermission(currentUser.value, 'VIEW_DASHBOARDS'),
);
const canManageCategories = computed(() =>
  hasPermission(currentUser.value, 'MANAGE_CATEGORIES'),
);
const canGenerateReports = computed(() =>
  hasPermission(currentUser.value, 'GENERATE_REPORTS'),
);
const isAdministrator = computed(() => hasPermission(currentUser.value, 'MANAGE_USERS'));

const userInitials = computed(() => {
  const name = currentUser.value?.fullName ?? currentUser.value?.username ?? '';
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
});

function toggleUserMenu(): void {
  isUserMenuOpen.value = !isUserMenuOpen.value;
}

async function handleLogout(): Promise<void> {
  clearSession();
  toast.info(t('core.nav.logout'));
  await router.push({ name: ROUTE_NAMES.LOGIN });
}

// Referenced to keep the PERMISSIONS import meaningful for future links
// (e.g. an "Assign Tasks" shortcut) without redeclaring the constant.
const permissionKeys = PERMISSIONS;
void permissionKeys;
</script>

<template>
  <div class="flex min-h-screen bg-slate-50 text-slate-900">
    <aside class="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
      <div class="flex h-16 items-center border-b border-slate-200 px-6">
        <router-link :to="{ name: ROUTE_NAMES.HOME }" class="text-base font-semibold tracking-tight">
          {{ t('core.appName') }}
        </router-link>
      </div>

      <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-4 text-sm">
        <router-link
          v-if="canViewDashboards"
          :to="{ name: ROUTE_NAMES.HOME }"
          class="block rounded-md px-3 py-2 font-medium text-slate-600 hover:bg-slate-100"
          active-class="bg-slate-100 text-slate-900"
        >
          {{ t('core.nav.dashboard') }}
        </router-link>

        <router-link
          :to="{ name: 'tasks.list' }"
          class="block rounded-md px-3 py-2 font-medium text-slate-600 hover:bg-slate-100"
          active-class="bg-slate-100 text-slate-900"
        >
          {{ t('core.nav.tasks') }}
        </router-link>

        <router-link
          v-if="canManageCategories"
          :to="{ name: 'categories.list' }"
          class="block rounded-md px-3 py-2 font-medium text-slate-600 hover:bg-slate-100"
          active-class="bg-slate-100 text-slate-900"
        >
          {{ t('core.nav.categories') }}
        </router-link>

        <router-link
          v-if="canGenerateReports"
          :to="{ name: 'reports' }"
          class="block rounded-md px-3 py-2 font-medium text-slate-600 hover:bg-slate-100"
          active-class="bg-slate-100 text-slate-900"
        >
          {{ t('core.nav.reports') }}
        </router-link>

        <router-link
          :to="{ name: 'notifications' }"
          class="block rounded-md px-3 py-2 font-medium text-slate-600 hover:bg-slate-100"
          active-class="bg-slate-100 text-slate-900"
        >
          {{ t('core.nav.notifications') }}
        </router-link>

        <!--
          `ROUTE_NAMES.ADMIN_DASHBOARD` ('admin.dashboard') has no
          matching registered route — `features/settings/routes.ts`
          registers its route as `'settings'` instead (see the
          inconsistency report). Linking to the name that's actually
          registered here so the link works; `route-names.constants.ts`
          or `features/settings/routes.ts` should still be reconciled
          to agree on one name.
        -->
        <router-link
          v-if="isAdministrator"
          :to="{ name: 'settings' }"
          class="block rounded-md px-3 py-2 font-medium text-slate-600 hover:bg-slate-100"
          active-class="bg-slate-100 text-slate-900"
        >
          {{ t('core.nav.admin') }}
        </router-link>
      </nav>
    </aside>

    <div class="flex min-w-0 flex-1 flex-col">
      <header class="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
        <div class="text-sm font-medium text-slate-500 md:hidden">
          {{ t('core.appName') }}
        </div>

        <div class="ml-auto flex items-center gap-3">
          <div class="relative">
            <button
              type="button"
              class="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-3 text-sm hover:bg-slate-50"
              @click="toggleUserMenu"
            >
              <span
                class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white"
              >
                {{ userInitials }}
              </span>
              <span class="max-w-[10rem] truncate font-medium text-slate-700">
                {{ currentUser?.fullName ?? currentUser?.username }}
              </span>
            </button>

            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 mt-2 w-48 rounded-md border border-slate-200 bg-white py-1 shadow-lg"
            >
              <router-link
                :to="{ name: 'user-profile' }"
                class="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                @click="isUserMenuOpen = false"
              >
                {{ t('core.nav.profile') }}
              </router-link>
              <button
                type="button"
                class="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-slate-50"
                @click="handleLogout"
              >
                {{ t('core.nav.logout') }}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto px-6 py-8">
        <router-view />
      </main>
    </div>
  </div>
</template>