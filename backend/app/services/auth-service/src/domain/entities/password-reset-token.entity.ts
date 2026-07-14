import { randomUUID } from 'node:crypto';

export interface PasswordResetTokenProps {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
}

/**
 * Represents a single-use password recovery token (FR-03).
 * Only the hash of the raw token is ever persisted.
 */
export class PasswordResetToken {
  private constructor(private props: PasswordResetTokenProps) {}

  static create(params: { userId: string; tokenHash: string; ttlMinutes: number }): PasswordResetToken {
    const now = new Date();

    return new PasswordResetToken({
      id: randomUUID(),
      userId: params.userId,
      tokenHash: params.tokenHash,
      expiresAt: new Date(now.getTime() + params.ttlMinutes * 60_000),
      createdAt: now,
    });
  }

  static reconstitute(props: PasswordResetTokenProps): PasswordResetToken {
    return new PasswordResetToken(props);
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get tokenHash(): string {
    return this.props.tokenHash;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get usedAt(): Date | undefined {
    return this.props.usedAt;
  }

  isExpired(): boolean {
    return new Date().getTime() > this.props.expiresAt.getTime();
  }

  isUsed(): boolean {
    return this.props.usedAt !== undefined;
  }

  isValid(): boolean {
    return !this.isExpired() && !this.isUsed();
  }

  markUsed(): void {
    this.props.usedAt = new Date();
  }
}
