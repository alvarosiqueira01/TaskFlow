import type { RouteRecordRaw } from 'vue-router';

const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('./pages/DashboardPage.vue'),
    meta: {
      requiresAuth: true,
      titleKey: 'dashboard.title', 
      layout: 'dashboard'
    },
  },
];

export default dashboardRoutes;
