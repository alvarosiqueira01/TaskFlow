<script setup lang="ts">
/**
 * router/views/HomeView.vue
 *
 * PLACEHOLDER: the `home` route must resolve to *something* — it's the
 * post-login/register redirect target and the guard's default landing
 * page — but no `dashboard` feature (KPI cards, tasks-by-status chart,
 * etc. per `taskflow-screens-visual-description.md` section 2) exists
 * yet. This is a minimal welcome screen only; replace `component` on
 * the `home` route in `router/routes/home.routes.ts` with the real
 * dashboard page once that feature is built, and delete this file.
 */
import { useAuth } from '../../features/auth/composables/useAuth';
import PageContainer from '../../shared/components/PageContainer.vue';
import PageHeader from '../../shared/components/PageHeader.vue';
import EmptyState from '../../shared/components/EmptyState.vue';

const { user } = useAuth();
</script>

<template>
  <PageContainer>
    <PageHeader
      title="Dashboard"
      :description="user ? `Welcome back, ${user.fullName ?? user.username}.` : undefined"
    />
    <EmptyState
      title="Your dashboard is on its way"
      description="Task summaries, status breakdowns, and recent activity will show up here."
    />
  </PageContainer>
</template>