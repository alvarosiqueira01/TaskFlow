/**
 * features/reports/locales/reports.messages.ts
 *
 * See `features/auth/locales/auth.messages.ts` for the pattern this
 * follows. `routes.ts`'s `meta.titleKey: 'reports.title'` resolves
 * against this bundle.
 *
 * `main.ts` calls `registerReportsLocaleMessages(i18n)` once, after
 * `createAppI18n()`.
 */

import type { I18n } from 'vue-i18n';
import type { SupportedLocale } from '../../../core/plugins/i18n.plugin';

export const reportsMessages: Record<SupportedLocale, Record<string, unknown>> = {
  en: {
    reports: {
      title: 'Reports',
    },
  },
  es: {
    reports: {
      title: 'Reportes',
    },
  },
};

export function registerReportsLocaleMessages(i18n: I18n): void {
  for (const [locale, messages] of Object.entries(reportsMessages)) {
    i18n.global.mergeLocaleMessage(locale, messages);
  }
}