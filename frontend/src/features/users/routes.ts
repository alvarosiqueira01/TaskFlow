import type { RouteRecordRaw } from 'vue-router';

const userRoutes: RouteRecordRaw[] = [
  {
    path: '/profile',
    name: 'user-profile',
    component: () => import('./pages/ProfilePage.vue'),
    meta: {
      requiresAuth: true,
      titleKey: 'users.profile.title',
      layout: 'dashboard',    
    },
  },
];

export default userRoutes;
