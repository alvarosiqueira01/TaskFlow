/**
 * features/auth/locales/auth.messages.ts
 *
 * Per `core/plugins/i18n.plugin.ts`'s own doc comment: "each feature is
 * expected to register its own message bundle... when it is built."
 * This is that bundle for the auth feature — route `titleKey`s
 * (`auth.login.title`, ...) resolve against these entries.
 *
 * The root `main.ts` (out of scope for this execution) is expected to
 * call `registerAuthLocaleMessages(i18n)` once, after
 * `createAppI18n()`, e.g.:
 *
 *   import { registerAuthLocaleMessages } from '@/features/auth/locales/auth.messages';
 *   registerAuthLocaleMessages(i18n);
 */

import type { I18n } from 'vue-i18n';
import type { SupportedLocale } from '../../../core/plugins/i18n.plugin';

export const authMessages: Record<SupportedLocale, Record<string, unknown>> = {
  en: {
    auth: {
      login: { title: 'Sign in' },
      register: { title: 'Create account' },
      forgotPassword: { title: 'Reset your password' },
      resetPassword: { title: 'Choose a new password' },
    },
  },
  es: {
    auth: {
      login: { title: 'Iniciar sesión' },
      register: { title: 'Crear cuenta' },
      forgotPassword: { title: 'Restablecer contraseña' },
      resetPassword: { title: 'Elegir una nueva contraseña' },
    },
  },
};

export function registerAuthLocaleMessages(i18n: I18n): void {
  for (const [locale, messages] of Object.entries(authMessages)) {
    i18n.global.mergeLocaleMessage(locale, messages);
  }
}
