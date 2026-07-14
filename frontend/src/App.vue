<script setup lang="ts">
/**
 * App.vue
 *
 * The root component, kept lightweight per
 * `frontend-architecture-standard.md`. Its responsibilities:
 *
 *  1. Bootstrap the session once via `authStore.initialize()`, which
 *     verifies any persisted token against `GET /users/me` and
 *     populates the reactive `user`. `core/router/guards/auth.guard.ts`
 *     itself only checks the token's local expiry and does not wait on
 *     this — but without gating on `isInitialized` here, authenticated
 *     layouts (`DashboardLayout`, `AdminLayout`) would briefly render
 *     with no user data on a hard refresh. A small `Spinner` covers
 *     that gap instead of a blank/half-populated page, per
 *     `UI-UX-guidelines.md` section 13.
 *  2. Resolve which layout (`layouts/*.vue`) the current route uses,
 *     via `meta.layout` (declared per-route in each feature's
 *     `routes.ts`, defaulting to `'default'`). Each layout already
 *     hosts its own `<router-view />` internally, so this component
 *     does not render a router-view itself — it delegates to the
 *     resolved layout.
 *  3. Mount the global `ToastContainer` provider once, so
 *     `useToast()` calls from anywhere in the app render somewhere.
 */
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from './features/auth/composables/useAuth';
import DefaultLayout from './layouts/DefaultLayout.vue';
import AuthLayout from './layouts/AuthLayout.vue';
import DashboardLayout from './layouts/DashboardLayout.vue';
import AdminLayout from './layouts/AdminLayout.vue';
import ToastContainer from './shared/components/ToastContainer.vue';
import Spinner from './shared/components/Spinner.vue';

const route = useRoute();
const { isInitialized, initialize } = useAuth();

onMounted(() => {
  void initialize();
});

const layoutComponents = {
  default: DefaultLayout,
  auth: AuthLayout,
  dashboard: DashboardLayout,
  admin: AdminLayout,
} as const;

const currentLayout = computed(() => layoutComponents[route.meta.layout ?? 'default']);
</script>

<template>
  <div v-if="!isInitialized" class="flex min-h-screen items-center justify-center">
    <Spinner size="lg" label="Loading your workspace…" />
  </div>
  <component :is="currentLayout" v-else />
  <ToastContainer />
</template>