/**
 * core/auth/token-storage.ts
 *
 * Persists the JWT access token and the last-known authenticated user
 * profile in `localStorage`, under the keys declared in
 * `core/constants/storage-keys.constants.ts`.
 *
 * This module owns all direct `localStorage` access related to the
 * session; nothing outside `core/auth` should read/write these keys
 * directly.
 */

import { STORAGE_KEYS } from '../constants/storage-keys.constants';
import type { User } from './types/auth.types';

export function getStoredAccessToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export function setStoredAccessToken(token: string): void {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
}

export function clearStoredAccessToken(): void {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User): void {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));
}

export function clearStoredUser(): void {
  localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
}

/** Persists the path the user attempted to visit before being redirected to login. */
export function setRedirectAfterLogin(path: string): void {
  sessionStorage.setItem(STORAGE_KEYS.REDIRECT_AFTER_LOGIN, path);
}

export function consumeRedirectAfterLogin(): string | null {
  const path = sessionStorage.getItem(STORAGE_KEYS.REDIRECT_AFTER_LOGIN);
  if (path) {
    sessionStorage.removeItem(STORAGE_KEYS.REDIRECT_AFTER_LOGIN);
  }
  return path;
}

/** Clears the entire local session (token + profile). Called on logout or 401. */
export function clearSession(): void {
  clearStoredAccessToken();
  clearStoredUser();
}
