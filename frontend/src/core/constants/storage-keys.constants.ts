/**
 * core/constants/storage-keys.constants.ts
 *
 * Centralized keys for anything persisted in browser storage.
 * Never hardcode a storage key string outside of this file.
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'tm_access_token',
  USER_PROFILE: 'tm_user_profile',
  PREFERRED_LOCALE: 'tm_preferred_locale',
  REDIRECT_AFTER_LOGIN: 'tm_redirect_after_login',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
