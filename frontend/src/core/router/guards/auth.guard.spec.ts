import { createAuthGuard } from './auth.guard';
import * as JwtUtil from '../../auth/jwt.util';
import * as TokenStorage from '../../auth/token-storage';
import { ROUTE_NAMES } from '../../constants/route-names.constants';
import type { RouteLocationNormalized } from 'vue-router';
import { describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';

vi.mock('../../auth/jwt.util');
vi.mock('../../auth/token-storage');

describe('auth.guard.ts', () => {
  const guard = createAuthGuard();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('redirects unauthenticated users from protected routes to LOGIN', () => {
    (JwtUtil.isAccessTokenValid as Mock).mockReturnValue(false);

    const to = {
      fullPath: '/dashboard',
      meta: { requiresAuth: true },
    } as RouteLocationNormalized;

    const result = guard(to, {} as RouteLocationNormalized, vi.fn());

    expect(result).toEqual({ name: ROUTE_NAMES.LOGIN });
    expect(TokenStorage.setRedirectAfterLogin).toHaveBeenCalledWith('/dashboard');
  });

  it('redirects authenticated users away from guestOnly routes', () => {
    (JwtUtil.isAccessTokenValid as Mock).mockReturnValue(true);

    const to = {
      fullPath: '/login',
      meta: { guestOnly: true, requiresAuth: false },
    } as RouteLocationNormalized;

    const result = guard(to, {} as RouteLocationNormalized, vi.fn());

    expect(result).toEqual({ name: ROUTE_NAMES.HOME });
  });

  it('allows access to public routes without authentication', () => {
    (JwtUtil.isAccessTokenValid as Mock).mockReturnValue(false);

    const to = {
      fullPath: '/public',
      meta: { requiresAuth: false },
    } as RouteLocationNormalized;

    const result = guard(to, {} as RouteLocationNormalized, vi.fn());

    expect(result).toBe(true);
  });
});