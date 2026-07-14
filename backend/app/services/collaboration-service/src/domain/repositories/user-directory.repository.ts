export interface UserSummary {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
}

/**
 * Synchronous read port to the Auth/User bounded context.
 * Implemented by an HTTP adapter in the Infrastructure layer.
 */
export interface UserDirectoryRepository {
  findManyByIds(userIds: string[]): Promise<UserSummary[]>;
}
