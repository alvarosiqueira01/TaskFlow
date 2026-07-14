/**
 * features/settings/locales/settings.messages.ts
 *
 * See `features/auth/locales/auth.messages.ts` for the pattern this
 * follows. `routes.ts`'s `meta.titleKey: 'settings.title'` resolves
 * against this bundle. The `subtitle` key mirrors the copy already
 * hardcoded in `pages/SettingsPage.vue` ("Administrative role
 * management."), kept here so that page can adopt `useI18n()` later
 * without inventing new wording.
 *
 * `main.ts` calls `registerSettingsLocaleMessages(i18n)` once, after
 * `createAppI18n()`.
 */

import type { I18n } from 'vue-i18n';
import type { SupportedLocale } from '../../../core/plugins/i18n.plugin';

export const settingsMessages: Record<SupportedLocale, Record<string, unknown>> = {
  en: {
    settings: {
      title: 'Settings',
      subtitle: 'Administrative role management.',
    },
  },
  es: {
    settings: {
      title: 'Configuración',
      subtitle: 'Gestión administrativa de roles.',
    },
  },
};

export function registerSettingsLocaleMessages(i18n: I18n): void {
  for (const [locale, messages] of Object.entries(settingsMessages)) {
    i18n.global.mergeLocaleMessage(locale, messages);
  }
}