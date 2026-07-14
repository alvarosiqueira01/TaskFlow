<script setup lang="ts">
/**
 * layouts/AuthLayout.vue
 *
 * Layout for the authentication feature's `pages/` (login, register,
 * forgot/reset password). Centers a single card on the screen — no
 * navigation, no authenticated-user chrome, since these routes are
 * `meta.guestOnly` and reachable only when the session is inactive.
 */
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
    <div class="w-full max-w-md">
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-semibold tracking-tight text-slate-900">
          {{ t('core.appName') }}
        </h1>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <router-view />
      </div>
    </div>
  </div>
</template>
