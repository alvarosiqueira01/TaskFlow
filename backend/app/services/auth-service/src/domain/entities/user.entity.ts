import { randomUUID } from 'node:crypto';
import { DomainError } from '@backend/shared';
import { Email } from '../value-objects/email.vo';
import { Username } from '../value-objects/username.vo';
import { Role } from './role.entity';

export interface UserProps {
  id: string;
  username: Username;
  email: Email;
  passwordHash: string;
  fullName?: string;
  avatarUrl?: string;
  isActive: boolean;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User entity - the aggregate root owned by auth-service.
 * Has no knowledge of HTTP, databases, or JWT: those are Infrastructure concerns.
 */
export class User {
  private constructor(private props: UserProps) {}

  static create(params: {
    username: string;
    email: string;
    passwordHash: string;
    fullName?: string;
    defaultRole: Role;
  }): User {
    const now = new Date();

    return new User({
      id: randomUUID(),
      username: Username.create(params.username),
      email: Email.create(params.email),
      passwordHash: params.passwordHash,
      fullName: params.fullName,
      avatarUrl: undefined,
      isActive: true,
      roles: [params.defaultRole],
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: UserProps): User {
    return new User(props);
  }

  get id(): string {
    return this.props.id;
  }

  get username(): string {
    return this.props.username.toString();
  }

  get email(): string {
    return this.props.email.toString();
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get fullName(): string | undefined {
    return this.props.fullName;
  }

  get avatarUrl(): string | undefined {
    return this.props.avatarUrl;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get roles(): Role[] {
    return this.props.roles;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updateProfile(params: { fullName?: string; avatarUrl?: string }): void {
    if (params.fullName !== undefined) {
      this.props.fullName = params.fullName;
    }
    if (params.avatarUrl !== undefined) {
      this.props.avatarUrl = params.avatarUrl;
    }
    this.props.updatedAt = new Date();
  }

  changePassword(newPasswordHash: string): void {
    this.props.passwordHash = newPasswordHash;
    this.props.updatedAt = new Date();
  }

  replaceRoles(roles: Role[]): void {
    if (roles.length === 0) {
      throw new DomainError('A user must always have at least one role');
    }
    this.props.roles = roles;
    this.props.updatedAt = new Date();
  }

  hasRole(roleName: string): boolean {
    return this.props.roles.some((role) => role.name === roleName.toUpperCase());
  }

  deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  activate(): void {
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }
}
