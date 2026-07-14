export interface UserContactSummary {
  id: string;
  fullName: string;
  email: string;
  pushToken?: string;
}

/**
 * Synchronous read port to the Auth/User bounded context, used to resolve
 * recipient contact details (email/push token) for a given userId.
 */
export interface UserDirectoryRepository {
  findById(userId: string): Promise<UserContactSummary | null>;
}
