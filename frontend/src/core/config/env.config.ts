/**
 * core/config/env.config.ts
 *
 * Centralizes access to Vite environment variables.
 * No other file in the application should read `import.meta.env` directly;
 * everything must go through this module so environment access stays
 * typed, validated, and easy to mock in tests.
 *
 * Expected `.env` variables (see `.env.example`):
 *   VITE_API_BASE_URL
 *   VITE_APP_NAME
 *   VITE_APP_ENV
 *   VITE_ENABLE_ADAPTIVE_STREAMING
 *   VITE_ENABLE_REQUEST_LOGGING
 */

export type AppEnvironment = 'local' | 'staging' | 'production';

interface EnvConfig {
  /** Base URL of the API Gateway, matching one of the `servers` entries in swagger.yaml */
  apiBaseUrl: string;
  /** Display name used across the UI (browser tab title, layouts, emails preview, etc.) */
  appName: string;
  /** Current runtime environment */
  appEnvironment: AppEnvironment;
  /** Whether adaptive bitrate streaming (HLS) is enabled on the client */
  enableAdaptiveStreaming: boolean;
  /** Whether verbose HTTP request/response logging is enabled */
  enableRequestLogging: boolean;
  /** Default HTTP request timeout, in milliseconds */
  requestTimeoutMs: number;
}

function readBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value === 'true' || value === '1';
}

function readEnvironment(value: string | undefined): AppEnvironment {
  if (value === 'production' || value === 'staging' || value === 'local') {
    return value;
  }
  return 'local';
}

function resolveDefaultApiBaseUrl(environment: AppEnvironment): string {
  switch (environment) {
    case 'production':
      return 'https://api.taskmanager.local/v1';
    case 'staging':
      return 'https://staging.api.taskmanager.local/v1';
    case 'local':
    default:
      return 'http://localhost:3000/v1';
  }
}

const rawEnv = import.meta.env;
const resolvedEnvironment = readEnvironment(rawEnv.VITE_APP_ENV as string | undefined);

export const envConfig: EnvConfig = {
  apiBaseUrl:
    (rawEnv.VITE_API_BASE_URL as string | undefined) ??
    resolveDefaultApiBaseUrl(resolvedEnvironment),
  appName: (rawEnv.VITE_APP_NAME as string | undefined) ?? 'Distributed Task Manager',
  appEnvironment: resolvedEnvironment,
  enableAdaptiveStreaming: readBoolean(
    rawEnv.VITE_ENABLE_ADAPTIVE_STREAMING as string | undefined,
    false,
  ),
  enableRequestLogging: readBoolean(
    rawEnv.VITE_ENABLE_REQUEST_LOGGING as string | undefined,
    resolvedEnvironment === 'local',
  ),
  requestTimeoutMs: 15_000,
};

export const isProduction = (): boolean => envConfig.appEnvironment === 'production';
export const isLocal = (): boolean => envConfig.appEnvironment === 'local';
