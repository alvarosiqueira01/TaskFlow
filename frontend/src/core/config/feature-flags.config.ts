/**
 * core/config/feature-flags.config.ts
 *
 * Runtime feature flags. These gate capabilities that may not be
 * available in every environment/release (e.g. adaptive streaming is
 * called out in the PRD as a "Release 3" capability).
 *
 * Flags default from `envConfig` but are kept in a dedicated module so
 * feature code depends on semantic flag names, not raw env variables.
 */

import { envConfig } from './env.config';

export const featureFlags = {
  /** NFR-30 / Release 3: HLS adaptive bitrate playback for video attachments */
  adaptiveStreaming: envConfig.enableAdaptiveStreaming,

  /** Verbose console logging of HTTP requests/responses (local debugging only) */
  requestLogging: envConfig.enableRequestLogging,

  /** Multipart upload flow for large media files (see /media/multipart endpoints) */
  multipartMediaUpload: true,
} as const;

export type FeatureFlagKey = keyof typeof featureFlags;

export function isFeatureEnabled(flag: FeatureFlagKey): boolean {
  return Boolean(featureFlags[flag]);
}
