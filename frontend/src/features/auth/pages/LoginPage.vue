<script setup lang="ts">
/**
 * features/auth/pages/LoginPage.vue
 *
 * Rendered inside `<AuthLayout>` (via `routes.ts`'s `meta.layout: 'auth'`).
 * Pages stay minimal per `frontend-architecture-standard.md`: compose
 * the feature component, no business logic of their own.
 */
import LoginForm from '../components/LoginForm.vue';
</script>

<template>
  <div>
    <h2 class="mb-6 text-center text-lg font-semibold text-slate-900">Sign in to your account</h2>
    <LoginForm />
  </div>
</template>
