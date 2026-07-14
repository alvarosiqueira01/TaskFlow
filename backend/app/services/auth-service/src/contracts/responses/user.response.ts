import type { RoleResponse } from './role.response';

/**
 * Mirrors the `User` schema in _A6_swagger.yaml.
 */
export interface UserResponse {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  isActive: boolean;
  roles: RoleResponse[];
  createdAt: string;
}
