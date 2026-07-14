/**
 * Domain-level port for password hashing. The Application layer
 * depends only on this interface; Infrastructure provides the
 * concrete bcrypt implementation.
 */
export interface PasswordHasher {
  hash(plainPassword: string): Promise<string>;
  compare(plainPassword: string, passwordHash: string): Promise<boolean>;
}
