import { DomainError } from '@backend/shared';

const USERNAME_REGEX = /^[a-zA-Z0-9._-]+$/;

/**
 * Immutable Username value object (FR-01, FR-04).
 */
export class Username {
  private constructor(private readonly raw: string) {}

  static create(value: string): Username {
    const trimmed = value.trim();

    if (trimmed.length < 3 || trimmed.length > 50) {
      throw new DomainError('Username must be between 3 and 50 characters');
    }

    if (!USERNAME_REGEX.test(trimmed)) {
      throw new DomainError('Username may only contain letters, numbers, dots, underscores and hyphens');
    }

    return new Username(trimmed);
  }

  equals(other: Username): boolean {
    return this.raw === other.raw;
  }

  toString(): string {
    return this.raw;
  }
}
