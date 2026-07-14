import type { RouteRecordRaw } from 'vue-router';
import { ROUTE_NAMES } from '../../core/constants/route-names.constants';

const settingsRoutes: RouteRecordRaw[] = [
  {
    path: '/settings',
    name: ROUTE_NAMES.ADMIN_DASHBOARD,
    component: () => import('./pages/SettingsPage.vue'),
    meta: {
      requiresAuth: true,
      roles: ['ADMIN'],
      titleKey: 'settings.title',
      layout: 'admin',
    },  
  },
];

export default settingsRoutes;
