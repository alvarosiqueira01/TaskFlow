/**
 * core/router/guards/auth.guard.ts
 *
 * Global navigation guard enforcing `meta.requiresAuth` /
 * `meta.guestOnly`. Registered by the root router (out of scope) via:
 *
 *   router.beforeEach(createAuthGuard());
 *
 * Does not know about specific feature routes; it only reasons about
 * route meta and the current session state.
 */

import type { NavigationGuard, RouteLocationNormalized } from 'vue-router';
import { ROUTE_NAMES } from '../../constants/route-names.constants';
import { getStoredAccessToken, setRedirectAfterLogin } from '../../auth/token-storage';
import { isAccessTokenValid } from '../../auth/jwt.util';

function isSessionActive(): boolean {
  return isAccessTokenValid(getStoredAccessToken());
}

export function createAuthGuard(): NavigationGuard {
  return (to: RouteLocationNormalized) => {
    const requiresAuth = to.meta.requiresAuth !== false;
    const isGuestOnly = to.meta.guestOnly === true;
    const authenticated = isSessionActive();

    if (isGuestOnly && authenticated) {
      return { name: ROUTE_NAMES.HOME };
    }

    if (requiresAuth && !authenticated) {
      setRedirectAfterLogin(to.fullPath);
      return { name: ROUTE_NAMES.LOGIN };
    }

    return true;
  };
}
