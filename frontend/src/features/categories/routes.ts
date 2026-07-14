import type { RouteRecordRaw } from 'vue-router';

const categoriesRoutes: RouteRecordRaw[] = [
  {
    path: '/categories',
    name: 'categories.list',
    component: () => import('./pages/CategoryListPage.vue'),
    meta: { requiresAuth: true, titleKey: 'categories.list.title', layout: 'dashboard' },
  },
];

export default categoriesRoutes;
