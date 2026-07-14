import type { RouteRecordRaw } from 'vue-router';

const reportsRoutes: RouteRecordRaw[] = [
  {
    path: '/reports',
    name: 'reports',
    component: () => import('./pages/ReportsPage.vue'),
    meta: {
      requiresAuth: true,
      titleKey: 'reports.title',
      layout: 'dashboard'
    },
  },
];

export default reportsRoutes;
