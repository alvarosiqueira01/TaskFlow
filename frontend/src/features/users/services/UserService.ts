// Assumes a centralized Axios instance is exported from core/api, per
// Frontend Architecture Standard ("core/api/ - Axios instance, interceptors").
import { httpClient } from '@/core/api/http-client';
import type { User, UpdateProfileRequest, ChangePasswordRequest } from '../types/user.types';

export class UserService {
  /** GET /users/me */
  async getCurrentUser(): Promise<User> {
    const { data } = await httpClient.get<User>('/users/me');
    return data;
  }

  /** PATCH /users/me */
  async updateCurrentUser(payload: UpdateProfileRequest): Promise<User> {
    const { data } = await httpClient.patch<User>('/users/me', payload);
    return data;
  }

  /**
   * PATCH /users/me/password
   * The contract defines a 200 response with no content, so no body
   * is returned here.
   */
  async changePassword(payload: ChangePasswordRequest): Promise<void> {
    await httpClient.patch('/users/me/password', payload);
  }
}

export const userService = new UserService();
