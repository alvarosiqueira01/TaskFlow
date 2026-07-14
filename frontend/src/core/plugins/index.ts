/**
 * core/plugins/index.ts
 *
 * Aggregates plugin creation/registration so `main.ts` (out of scope
 * for this execution) only needs a single call:
 *
 *   import { registerPlugins } from '@/core/plugins';
 *   const app = createApp(App);
 *   registerPlugins(app);
 *
 * Vue Router is intentionally NOT registered here: per
 * `frontend-architecture-standard.md`, the router instance is
 * assembled in the root `router/` directory using the guards exposed
 * by `core/router`; `main.ts` calls `app.use(router)` itself.
 *
 * Returns the created `pinia`/`i18n` instances so `main.ts` can hand
 * `i18n` to each feature's `registerXLocaleMessages(i18n)` (see
 * `features/auth/locales/auth.messages.ts`) after registration.
 */

import type { App } from 'vue';
import type { Pinia } from 'pinia';
import type { I18n } from 'vue-i18n';
import { createAppPinia } from './pinia.plugin';
import { createAppI18n } from './i18n.plugin';
import { toastPlugin } from './toast.plugin';

export function registerPlugins(app: App): { pinia: Pinia; i18n: I18n } {
  const pinia = createAppPinia();
  const i18n = createAppI18n();

  app.use(pinia);
  app.use(i18n);
  app.use(toastPlugin);

  return { pinia, i18n };
}

export { useToast } from './toast.plugin';
export type { ToastMessage, ToastVariant } from './toast.plugin';
export type { SupportedLocale } from './i18n.plugin';