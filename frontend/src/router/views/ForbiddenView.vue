<script setup lang="ts">
/**
 * router/views/ForbiddenView.vue
 *
 * Rendered when `core/router/guards/permission.guard.ts` redirects to
 * `error.forbidden`. Human-readable/actionable per
 * `UI-UX-guidelines.md` section 14; message text reuses the
 * `core.errors.forbidden` i18n key already declared in
 * `core/plugins/i18n.plugin.ts`.
 */
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { ShieldAlert } from 'lucide-vue-next';
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
    <EmptyState title="Access denied" :description="t('core.errors.forbidden')" :icon="ShieldAlert">
      <template #action>
        <BaseButton @click="goHome">Back to dashboard</BaseButton>
      </template>
    </EmptyState>
  </div>
</template>