import { DomainError } from '@backend/shared';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Immutable Email value object. Guarantees every Email instance
 * held by the domain is well-formed and normalized (lowercase, trimmed).
 */
export class Email {
  private constructor(private readonly raw: string) {}

  static create(value: string): Email {
    const normalized = value.trim().toLowerCase();

    if (normalized.length === 0 || normalized.length > 255) {
      throw new DomainError('Email must be between 1 and 255 characters');
    }

    if (!EMAIL_REGEX.test(normalized)) {
      throw new DomainError(`Invalid email address: ${value}`);
    }

    return new Email(normalized);
  }

  equals(other: Email): boolean {
    return this.raw === other.raw;
  }

  toString(): string {
    return this.raw;
  }
}
