import type { RouteRecordRaw } from 'vue-router';

const notificationRoutes: RouteRecordRaw[] = [
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('./pages/NotificationsPage.vue'),
    meta: {
      requiresAuth: true,
      titleKey: 'notifications.title',
      layout: 'dashboard'
    },
  },
];

export default notificationRoutes;
