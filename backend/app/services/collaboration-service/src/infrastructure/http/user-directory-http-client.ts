import { UserDirectoryRepository, UserSummary } from '../../domain/repositories/user-directory.repository.js';

interface UserDirectoryHttpClientConfig {
  baseUrl: string;
  internalToken: string;
}

/**
 * REST adapter to the Auth/User bounded context, used to resolve
 * user summaries synchronously for assignment listing responses.
 */
export class UserDirectoryHttpClient implements UserDirectoryRepository {
  constructor(private readonly config: UserDirectoryHttpClientConfig) {}

  async findManyByIds(userIds: string[]): Promise<UserSummary[]> {
    if (userIds.length === 0) return [];

    const response = await fetch(`${this.config.baseUrl}/users/batch?ids=${userIds.join(',')}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.config.internalToken}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users from user directory: ${response.status}`);
    }

    const data = (await response.json()) as UserSummary[];
    return data;
  }
}
