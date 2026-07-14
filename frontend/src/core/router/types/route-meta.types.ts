/**
 * core/router/types/route-meta.types.ts
 *
 * Augments Vue Router's `RouteMeta` so every feature's `routes.ts` gets
 * typed autocompletion for the metadata that CORE guards understand.
 */

import 'vue-router';
import type { PermissionKey } from '../../constants/permissions.constants';
import type { RoleName } from '../../constants/permissions.constants';
import type { LayoutName } from '../../constants/layout-names.constants';

declare module 'vue-router' {
  interface RouteMeta {
    /** Route requires an authenticated session. Defaults to `true` unless explicitly `false`. */
    requiresAuth?: boolean;
    /** Route is only reachable by guests (e.g. login/register) and redirects authenticated users away. */
    guestOnly?: boolean;
    /** Any one of these roles is sufficient to access the route. */
    roles?: RoleName[];
    /** Any one of these frontend permission identifiers is sufficient to access the route. */
    permissions?: PermissionKey[];
    /** Name of the layout component this route should render inside. */
    layout?: LayoutName;
    /** i18n key used to set the document title. */
    titleKey?: string;
  }
}
