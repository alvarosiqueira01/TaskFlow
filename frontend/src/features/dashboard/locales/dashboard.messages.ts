/**
 * features/dashboard/locales/dashboard.messages.ts
 *
 * See `features/auth/locales/auth.messages.ts` for the pattern this
 * follows. `routes.ts`'s `meta.titleKey: 'dashboard.title'` resolves
 * against this bundle.
 *
 * `main.ts` calls `registerDashboardLocaleMessages(i18n)` once, after
 * `createAppI18n()`.
 */

import type { I18n } from 'vue-i18n';
import type { SupportedLocale } from '../../../core/plugins/i18n.plugin';

export const dashboardMessages: Record<SupportedLocale, Record<string, unknown>> = {
  en: {
    dashboard: {
      title: 'Dashboard',
    },
  },
  es: {
    dashboard: {
      title: 'Panel',
    },
  },
};

export function registerDashboardLocaleMessages(i18n: I18n): void {
  for (const [locale, messages] of Object.entries(dashboardMessages)) {
    i18n.global.mergeLocaleMessage(locale, messages);
  }
}