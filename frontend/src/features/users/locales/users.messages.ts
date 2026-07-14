/**
 * features/users/locales/users.messages.ts
 *
 * See `features/auth/locales/auth.messages.ts` for the pattern this
 * follows. `routes.ts`'s `meta.titleKey: 'users.profile.title'`
 * resolves against this bundle.
 *
 * `main.ts` calls `registerUsersLocaleMessages(i18n)` once, after
 * `createAppI18n()`.
 */

import type { I18n } from 'vue-i18n';
import type { SupportedLocale } from '../../../core/plugins/i18n.plugin';

export const usersMessages: Record<SupportedLocale, Record<string, unknown>> = {
  en: {
    users: {
      profile: { title: 'Profile' },
    },
  },
  es: {
    users: {
      profile: { title: 'Perfil' },
    },
  },
};

export function registerUsersLocaleMessages(i18n: I18n): void {
  for (const [locale, messages] of Object.entries(usersMessages)) {
    i18n.global.mergeLocaleMessage(locale, messages);
  }
}