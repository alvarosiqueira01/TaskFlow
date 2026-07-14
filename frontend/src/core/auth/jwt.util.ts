/**
 * core/auth/jwt.util.ts
 *
 * Minimal, dependency-free helpers to inspect a JWT access token on the
 * client. The token itself is always issued and verified by the Auth
 * Service (server-side); the frontend only ever decodes it locally to
 * make UX decisions (e.g. pre-emptively redirecting to login before an
 * API call fails with 401).
 */

import type { DecodedAccessToken } from './types/auth.types';

/**
 * Decodes the payload segment of a JWT without validating its signature.
 * Returns `null` if the token is malformed.
 */
export function decodeAccessToken(token: string): DecodedAccessToken | null {
  const segments = token.split('.');
  if (segments.length !== 3) {
    return null;
  }

  try {
    const payloadSegment = segments[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = payloadSegment.padEnd(
      payloadSegment.length + ((4 - (payloadSegment.length % 4)) % 4),
      '=',
    );
    const decoded = atob(padded);
    const json = decodeURIComponent(
      Array.from(decoded)
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''),
    );
    return JSON.parse(json) as DecodedAccessToken;
  } catch {
    return null;
  }
}

/**
 * Returns `true` when the token is well-formed and its `exp` claim is in
 * the future. A small safety margin (default 5s) avoids racing a token
 * that is about to expire mid-request.
 */
export function isAccessTokenValid(token: string | null | undefined, marginSeconds = 5): boolean {
  if (!token) return false;

  const decoded = decodeAccessToken(token);
  if (!decoded || typeof decoded.exp !== 'number') {
    return false;
  }

  const nowInSeconds = Date.now() / 1000;
  return decoded.exp - marginSeconds > nowInSeconds;
}

export function getAccessTokenExpiry(token: string): Date | null {
  const decoded = decodeAccessToken(token);
  if (!decoded || typeof decoded.exp !== 'number') {
    return null;
  }
  return new Date(decoded.exp * 1000);
}
