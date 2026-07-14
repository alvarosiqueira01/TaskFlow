import type { RouteRecordRaw } from 'vue-router';

const tasksRoutes: RouteRecordRaw[] = [
  {
    path: '/tasks',
    name: 'tasks.list',
    component: () => import('./pages/TaskListPage.vue'),
    meta: { requiresAuth: true, titleKey: 'tasks.list.title', layout: 'dashboard' },
  },
  {
    path: '/tasks/:id',
    name: 'tasks.details',
    component: () => import('./pages/TaskDetailsPage.vue'),
    meta: { requiresAuth: true, titleKey: 'tasks.details.title', layout: 'dashboard' },
    props: true,
  },
];

export default tasksRoutes;
