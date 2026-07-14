/**
 * shared/directives/index.ts
 *
 * Registers every shared directive as a single Vue plugin so `main.ts`
 * (out of scope for this execution) only needs one call:
 *
 *   import { sharedDirectivesPlugin } from '@/shared/directives';
 *   app.use(sharedDirectivesPlugin);
 */

import type { App, Plugin } from 'vue';
import { vClickOutside } from './click-outside.directive';
import { vAutofocus } from './autofocus.directive';
import { vPermission } from './permission.directive';

export const sharedDirectivesPlugin: Plugin = {
  install(app: App) {
    app.directive('click-outside', vClickOutside);
    app.directive('autofocus', vAutofocus);
    app.directive('permission', vPermission);
  },
};

export { vClickOutside, vAutofocus, vPermission };
