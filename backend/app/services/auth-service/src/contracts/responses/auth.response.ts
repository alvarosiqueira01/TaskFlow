import type { UserResponse } from './user.response';

/**
 * Mirrors the `AuthResponse` schema in _A6_swagger.yaml.
 */
export interface AuthResponse {
  accessToken: string;
  user: UserResponse;
}
