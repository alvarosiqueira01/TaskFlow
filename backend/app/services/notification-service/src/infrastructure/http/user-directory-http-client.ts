import { UserContactSummary, UserDirectoryRepository } from '../../domain/repositories/user-directory.repository.js';

interface UserDirectoryHttpClientConfig {
  baseUrl: string;
  internalToken: string;
}

/**
 * REST adapter to the Auth/User bounded context, used to resolve
 * recipient contact information (email/push token) synchronously.
 */
export class UserDirectoryHttpClient implements UserDirectoryRepository {
  constructor(private readonly config: UserDirectoryHttpClientConfig) {}

  async findById(userId: string): Promise<UserContactSummary | null> {
    const response = await fetch(`${this.config.baseUrl}/users/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.config.internalToken}`,
        Accept: 'application/json',
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch user ${userId} from user directory: ${response.status}`);
    }

    const data = (await response.json()) as UserContactSummary;
    return data;
  }
}
