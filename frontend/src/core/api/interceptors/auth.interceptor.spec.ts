import { attachAuthorizationHeader, attachIdempotencyKey } from './auth.interceptor';
import * as TokenStorage from '../../auth/token-storage';
import * as JwtUtil from '../../auth/jwt.util';
import type { InternalAxiosRequestConfig, AxiosHeaders } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';

vi.mock('../../auth/token-storage');
vi.mock('../../auth/jwt.util');

describe('auth.interceptor.ts', () => {
  let mockConfig: InternalAxiosRequestConfig;

  beforeEach(() => {
    mockConfig = {
      headers: {
        set: vi.fn(),
        has: vi.fn().mockReturnValue(false),
      } as unknown as AxiosHeaders,
    } as InternalAxiosRequestConfig;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('attachAuthorizationHeader', () => {
    it('attaches token for authenticated routes if token is valid', () => {
      mockConfig.url = '/tasks';
      (TokenStorage.getStoredAccessToken as Mock).mockReturnValue('valid-token');
      (JwtUtil.isAccessTokenValid as Mock).mockReturnValue(true);

      attachAuthorizationHeader(mockConfig);
      
      expect(mockConfig.headers.set).toHaveBeenCalledWith('Authorization', 'Bearer valid-token');
    });

    it('skips token attachment for public auth routes', () => {
      mockConfig.url = '/auth/login';
      (TokenStorage.getStoredAccessToken as Mock).mockReturnValue('valid-token');

      attachAuthorizationHeader(mockConfig);

      expect(mockConfig.headers.set).not.toHaveBeenCalled();
    });
  });

  describe('attachIdempotencyKey', () => {
    it('attaches Idempotency-Key if config specifies idempotent request', () => {
      const config = { ...mockConfig, idempotent: true } as InternalAxiosRequestConfig;
      
      attachIdempotencyKey(config);

      expect(config.headers.set).toHaveBeenCalledWith('Idempotency-Key', 'mock-uuid-1234-5678');
    });
  });
});