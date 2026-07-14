/**
 * core/plugins/pinia.plugin.ts
 *
 * Creates the single Pinia instance used by every feature store
 * (`store/` folders). Feature stores must import `usePinia`/the Pinia
 * `defineStore` API as usual — this module only owns instance creation
 * and app-level registration.
 */

import { createPinia, type Pinia } from 'pinia';

export function createAppPinia(): Pinia {
  return createPinia();
}
