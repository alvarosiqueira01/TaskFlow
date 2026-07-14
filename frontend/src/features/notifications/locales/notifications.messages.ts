/**
 * features/notifications/locales/notifications.messages.ts
 *
 * See `features/auth/locales/auth.messages.ts` for the pattern this
 * follows. `routes.ts`'s `meta.titleKey: 'notifications.title'`
 * resolves against this bundle.
 *
 * `main.ts` calls `registerNotificationsLocaleMessages(i18n)` once,
 * after `createAppI18n()`.
 */

import type { I18n } from 'vue-i18n';
import type { SupportedLocale } from '../../../core/plugins/i18n.plugin';

export const notificationsMessages: Record<SupportedLocale, Record<string, unknown>> = {
  en: {
    notifications: {
      title: 'Notifications',
    },
  },
  es: {
    notifications: {
      title: 'Notificaciones',
    },
  },
};

export function registerNotificationsLocaleMessages(i18n: I18n): void {
  for (const [locale, messages] of Object.entries(notificationsMessages)) {
    i18n.global.mergeLocaleMessage(locale, messages);
  }
}