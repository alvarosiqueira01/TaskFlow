// Assumes a centralized Axios instance is exported from core/api, per
// Frontend Architecture Standard ("core/api/ - Axios instance, interceptors").
import { httpClient } from '@/core/api/http-client';
import type { Role, UpdateUserRolesRequest } from '../types/settings.types';

export class SettingsService {
  /** GET /roles (Admin only, per the Admin tag in the contract) */
  async listRoles(): Promise<Role[]> {
    const { data } = await httpClient.get<Role[]>('/roles');
    return data;
  }

  /** GET /users/{id}/roles (Admin only) */
  async getUserRoles(userId: string): Promise<Role[]> {
    const { data } = await httpClient.get<Role[]>(`/users/${userId}/roles`);
    return data;
  }

  /**
   * PUT /users/{id}/roles (Admin only)
   * The contract's 200 response has no body — callers should re-fetch
   * via getUserRoles() to obtain the confirmed role list.
   */
  async updateUserRoles(userId: string, payload: UpdateUserRolesRequest): Promise<void> {
    await httpClient.put(`/users/${userId}/roles`, payload);
  }
}

export const settingsService = new SettingsService();
