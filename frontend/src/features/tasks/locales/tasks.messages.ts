/**
 * features/tasks/locales/tasks.messages.ts
 *
 * See `features/auth/locales/auth.messages.ts` for the pattern this
 * follows. `routes.ts` registers two routes for this feature —
 * `meta.titleKey: 'tasks.list.title'` and `'tasks.details.title'` —
 * both resolve against this bundle.
 *
 * `main.ts` calls `registerTasksLocaleMessages(i18n)` once, after
 * `createAppI18n()`.
 */

import type { I18n } from 'vue-i18n';
import type { SupportedLocale } from '../../../core/plugins/i18n.plugin';

export const tasksMessages: Record<SupportedLocale, Record<string, unknown>> = {
  en: {
    tasks: {
      list: { title: 'Tasks' },
      details: { title: 'Task Details' },
    },
  },
  es: {
    tasks: {
      list: { title: 'Tareas' },
      details: { title: 'Detalle de la tarea' },
    },
  },
};

export function registerTasksLocaleMessages(i18n: I18n): void {
  for (const [locale, messages] of Object.entries(tasksMessages)) {
    i18n.global.mergeLocaleMessage(locale, messages);
  }
}