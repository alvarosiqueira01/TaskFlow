/**
 * core/api/interceptors/auth.interceptor.ts
 *
 * Request interceptor responsible for attaching the `Authorization:
 * Bearer <token>` header, per the `bearerAuth` security scheme declared
 * in swagger.yaml. Applied to every request except the public
 * authentication endpoints.
 */

import type { InternalAxiosRequestConfig } from 'axios';
import { getStoredAccessToken } from '../../auth/token-storage';
import { isAccessTokenValid } from '../../auth/jwt.util';

/** Paths that must NOT receive an Authorization header (public endpoints). */
const PUBLIC_PATH_PATTERNS: RegExp[] = [
  /^\/auth\/register/,
  /^\/auth\/login/,
  /^\/auth\/password\/recovery/,
  /^\/auth\/password\/reset/,
];

function isPublicPath(url: string | undefined): boolean {
  if (!url) return false;
  return PUBLIC_PATH_PATTERNS.some((pattern) => pattern.test(url));
}

export function attachAuthorizationHeader(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  if (isPublicPath(config.url)) {
    return config;
  }

  const token = getStoredAccessToken();
  if (token && isAccessTokenValid(token)) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
}

/**
 * Attaches a client-generated `Idempotency-Key` header when the caller
 * explicitly requested one via `config.meta.idempotent`, matching the
 * `IdempotencyKey` parameter used by `createTask`, `completeMediaUpload`,
 * `replaceMedia`, and `completeMultipartUpload`.
 */
export function attachIdempotencyKey(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  const shouldGenerateKey = Boolean(
    (config as InternalAxiosRequestConfig & { idempotent?: boolean }).idempotent,
  );

  if (shouldGenerateKey && !config.headers.has('Idempotency-Key')) {
    config.headers.set('Idempotency-Key', crypto.randomUUID());
  }

  return config;
}
