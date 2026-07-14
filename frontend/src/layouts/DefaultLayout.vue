<script setup lang="ts">
/**
 * layouts/DefaultLayout.vue
 *
 * Minimal, chrome-light layout used for public/unauthenticated pages
 * that are not part of the auth flow (e.g. the marketing/landing page,
 * and the `error.forbidden` / `error.not-found` / `error.server-error`
 * fallback routes). Renders a lightweight header and footer around the
 * routed content.
 */
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <div class="flex min-h-screen flex-col bg-slate-50 text-slate-900">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <router-link :to="{ name: 'home' }" class="text-lg font-semibold tracking-tight">
          {{ t('core.appName') }}
        </router-link>
        <nav class="flex items-center gap-4 text-sm">
          <router-link
            :to="{ name: 'auth.login' }"
            class="rounded-md px-3 py-2 font-medium text-slate-600 hover:bg-slate-100"
          >
            {{ t('core.nav.profile') }}
          </router-link>
        </nav>
      </div>
    </header>

    <main class="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <router-view />
    </main>

    <footer class="border-t border-slate-200 bg-white">
      <div class="mx-auto max-w-6xl px-6 py-4 text-xs text-slate-500">
        &copy; {{ new Date().getFullYear() }} {{ t('core.appName') }}
      </div>
    </footer>
  </div>
</template>
