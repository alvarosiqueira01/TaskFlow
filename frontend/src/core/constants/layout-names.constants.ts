export const LAYOUT_NAMES = {
  default: 'default',
  auth: 'auth',
  dashboard: 'dashboard',
  admin: 'admin',
} as const;

export type LayoutName = keyof typeof LAYOUT_NAMES;
