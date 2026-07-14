<script setup lang="ts">
/**
 * router/views/ServerErrorView.vue
 *
 * Reachable at `/500` (named `error.server-error`) for cases where the
 * app wants to route to a dedicated "something went wrong" page rather
 * than an inline `ErrorAlert`. Message text reuses
 * `core.errors.serverError`.
 */
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { ServerCrash } from 'lucide-vue-next';
import EmptyState from '../../shared/components/EmptyState.vue';
import BaseButton from '../../shared/components/BaseButton.vue';
import { ROUTE_NAMES } from '../../core/constants/route-names.constants';

const { t } = useI18n();
const router = useRouter();

function goHome(): void {
  void router.push({ name: ROUTE_NAMES.HOME });
}

function reload(): void {
  window.location.reload();
}
</script>

<template>
  <div class="flex min-h-[60vh] items-center justify-center px-6">
    <EmptyState title="Something went wrong" :description="t('core.errors.serverError')" :icon="ServerCrash">
      <template #action>
        <div class="flex justify-center gap-3">
          <BaseButton variant="secondary" @click="goHome">Back to dashboard</BaseButton>
          <BaseButton @click="reload">Try again</BaseButton>
        </div>
      </template>
    </EmptyState>
  </div>
</template>