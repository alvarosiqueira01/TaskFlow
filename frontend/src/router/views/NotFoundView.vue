<script setup lang="ts">
/**
 * router/views/NotFoundView.vue
 *
 * Matched by the catch-all `/:pathMatch(.*)*` route in
 * `router/routes/error.routes.ts`. Message text reuses `core.errors.notFound`.
 */
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { FileQuestion } from 'lucide-vue-next';
import EmptyState from '../../shared/components/EmptyState.vue';
import BaseButton from '../../shared/components/BaseButton.vue';
import { ROUTE_NAMES } from '../../core/constants/route-names.constants';

const { t } = useI18n();
const router = useRouter();

function goHome(): void {
  void router.push({ name: ROUTE_NAMES.HOME });
}
</script>

<template>
  <div class="flex min-h-[60vh] items-center justify-center px-6">
    <EmptyState title="Page not found" :description="t('core.errors.notFound')" :icon="FileQuestion">
      <template #action>
        <BaseButton @click="goHome">Back to dashboard</BaseButton>
      </template>
    </EmptyState>
  </div>
</template>