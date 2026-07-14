/**
 * features/categories/locales/categories.messages.ts
 *
 * Per `core/plugins/i18n.plugin.ts`'s doc comment ("each feature is
 * expected to register its own message bundle... when it is built")
 * and mirroring `features/auth/locales/auth.messages.ts`: this is
 * that bundle for the `categories` feature. `routes.ts`'s
 * `meta.titleKey: 'categories.list.title'` resolves against this.
 *
 * `main.ts` calls `registerCategoriesLocaleMessages(i18n)` once,
 * after `createAppI18n()`.
 */

import type { I18n } from 'vue-i18n';
import type { SupportedLocale } from '../../../core/plugins/i18n.plugin';

export const categoriesMessages: Record<SupportedLocale, Record<string, unknown>> = {
  en: {
    categories: {
      list: { title: 'Categories' },
    },
  },
  es: {
    categories: {
      list: { title: 'Categorías' },
    },
  },
};

export function registerCategoriesLocaleMessages(i18n: I18n): void {
  for (const [locale, messages] of Object.entries(categoriesMessages)) {
    i18n.global.mergeLocaleMessage(locale, messages);
  }
}