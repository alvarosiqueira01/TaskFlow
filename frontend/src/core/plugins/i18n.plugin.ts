/**
 * core/plugins/i18n.plugin.ts
 *
 * Vue I18n instance used across the application. Only messages needed
 * by CORE infrastructure (layouts, guards, generic error states) are
 * declared here; each feature is expected to register its own message
 * bundle (e.g. via `i18n.global.mergeLocaleMessage`) when it is built.
 */

import { createI18n, type I18n } from 'vue-i18n';
import { STORAGE_KEYS } from '../constants/storage-keys.constants';

export type SupportedLocale = 'en' | 'es';

const coreMessages = {
  en: {
    core: {
      appName: 'TaskFlow',
      nav: {
        dashboard: 'Dashboard',
        tasks: 'Tasks',
        categories: 'Categories',
        reports: 'Reports',
        notifications: 'Notifications',
        admin: 'Administration',
        profile: 'Profile',
        logout: 'Log out',
      },
      errors: {
        forbidden: 'You do not have permission to view this page.',
        notFound: 'The page you are looking for could not be found.',
        serverError: 'Something went wrong. Please try again later.',
      },
      common: {
        loading: 'Loading…',
        retry: 'Retry',
        goBack: 'Go back',
      },
    },
  },
  es: {
    core: {
      appName: 'TaskFlow',
      nav: {
        dashboard: 'Panel',
        tasks: 'Tareas',
        categories: 'Categorías',
        reports: 'Reportes',
        notifications: 'Notificaciones',
        admin: 'Administración',
        profile: 'Perfil',
        logout: 'Cerrar sesión',
      },
      errors: {
        forbidden: 'No tienes permisos para ver esta página.',
        notFound: 'La página que buscas no existe.',
        serverError: 'Algo salió mal. Inténtalo de nuevo más tarde.',
      },
      common: {
        loading: 'Cargando…',
        retry: 'Reintentar',
        goBack: 'Volver',
      },
    },
  },
} as const;

function resolveInitialLocale(): SupportedLocale {
  const stored = localStorage.getItem(STORAGE_KEYS.PREFERRED_LOCALE);
  if (stored === 'en' || stored === 'es') return stored;

  const browserLocale = navigator.language?.slice(0, 2);
  return browserLocale === 'es' ? 'es' : 'en';
}

export function createAppI18n(): I18n {
  return createI18n({
    legacy: false,
    locale: resolveInitialLocale(),
    fallbackLocale: 'en',
    messages: coreMessages,
  });
}
