<script setup lang="ts">
/**
 * features/auth/pages/ResetPasswordPage.vue
 *
 * Reads the `token` query parameter from the password-recovery email
 * link (`?token=...`) and hands it to `ResetPasswordForm`. If the link
 * is missing or malformed, shows an actionable error state instead of
 * a broken form, per `UI-UX-guidelines.md` section 14 (human-readable,
 * actionable errors).
 */
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ResetPasswordForm from '../components/ResetPasswordForm.vue';
import ErrorAlert from '../../../shared/components/ErrorAlert.vue';
import { ROUTE_NAMES } from '../../../core/constants/route-names.constants';

const route = useRoute();

const token = computed(() => {
  const value = route.query.token;
  return typeof value === 'string' ? value : '';
});
</script>

<template>
  <div>
    <h2 class="mb-6 text-center text-lg font-semibold text-slate-900">Choose a new password</h2>

    <ResetPasswordForm v-if="token" :token="token" />

    <div v-else class="space-y-4">
      <ErrorAlert message="This password reset link is invalid or has expired. Please request a new one." />
      <p class="text-center text-sm text-slate-500">
        <router-link :to="{ name: ROUTE_NAMES.FORGOT_PASSWORD }" class="font-medium text-blue-600 hover:underline">
          Request a new link
        </router-link>
      </p>
    </div>
  </div>
</template>
