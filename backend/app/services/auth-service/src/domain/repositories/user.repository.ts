import type { User } from '../entities/user.entity';

/**
 * Repository interface (contract) for the User aggregate.
 * Implementations live in the Infrastructure layer (e.g. DrizzleUserRepository).
 */
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  existsByEmail(email: string): Promise<boolean>;
  existsByUsername(username: string): Promise<boolean>;
  save(user: User): Promise<void>;
  update(user: User): Promise<void>;
}
