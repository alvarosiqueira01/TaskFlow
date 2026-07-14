/**
 * main.ts
 *
 * Application bootstrap. Per `frontend-architecture-standard.md`, this
 * file is responsible only for: creating the Vue application,
 * registering plugins, initializing Pinia, configuring Vue Router, and
 * mounting the application. No business logic lives here.
 */

import { createApp } from 'vue';
import App from './App.vue';
import { registerPlugins } from './core/plugins';
import { sharedDirectivesPlugin } from './shared/directives';
import { router } from './router';
import './assets/main.css'
import { registerAuthLocaleMessages } from './features/auth/locales/auth.messages';
import { registerCategoriesLocaleMessages } from './features/categories/locales/categories.messages';
import { registerDashboardLocaleMessages } from './features/dashboard/locales/dashboard.messages';
import { registerNotificationsLocaleMessages } from './features/notifications/locales/notifications.messages';
import { registerReportsLocaleMessages } from './features/reports/locales/reports.messages';
import { registerSettingsLocaleMessages } from './features/settings/locales/settings.messages';
import { registerTasksLocaleMessages } from './features/tasks/locales/tasks.messages';
import { registerUsersLocaleMessages } from './features/users/locales/users.messages';

const app = createApp(App);

// Pinia + Vue I18n + the toast plugin. Returns the created `i18n`
// instance so each feature can merge its own locale messages (see
// `core/plugins/index.ts`'s doc comment).
const { i18n } = registerPlugins(app);

// Every feature that owns a route now ships a `locales/*.messages.ts`
// bundle and is registered here, following the pattern
// `features/auth/locales/auth.messages.ts` established first.
// `collaboration` and `media` are skipped deliberately — like their
// missing `routes.ts` (see `router/index.ts`), they're task-scoped and
// don't own any page-level `titleKey`s of their own to resolve.
registerAuthLocaleMessages(i18n);
registerCategoriesLocaleMessages(i18n);
registerDashboardLocaleMessages(i18n);
registerNotificationsLocaleMessages(i18n);
registerReportsLocaleMessages(i18n);
registerSettingsLocaleMessages(i18n);
registerTasksLocaleMessages(i18n);
registerUsersLocaleMessages(i18n);

// Global custom directives: v-click-outside, v-autofocus, v-permission.
// Several shared/components already import these directives locally
// (Vue 3.2+ `vFoo` script-setup convention), so this registration is a
// convenience for template-only usage elsewhere, not a hard dependency.
app.use(sharedDirectivesPlugin);

app.use(router);

app.mount('#app');