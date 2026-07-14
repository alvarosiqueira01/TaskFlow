/**
 * core/api/http-client.ts
 *
 * Single Axios instance used across the entire application. Every
 * feature's `services/*.ts` must import `httpClient` from here instead
 * of instantiating its own client, keeping base URL, timeouts, and
 * interceptors consistent everywhere.
 */

import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { envConfig } from '../config/env.config';
import { attachAuthorizationHeader, attachIdempotencyKey } from './interceptors/auth.interceptor';
import { handleResponseError, handleResponseSuccess } from './interceptors/error.interceptor';

export const httpClient: AxiosInstance = axios.create({
  baseURL: envConfig.apiBaseUrl,
  timeout: envConfig.requestTimeoutMs,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const withAuth = attachAuthorizationHeader(config);
  return attachIdempotencyKey(withAuth);
});

httpClient.interceptors.response.use(handleResponseSuccess, handleResponseError);

export default httpClient;
