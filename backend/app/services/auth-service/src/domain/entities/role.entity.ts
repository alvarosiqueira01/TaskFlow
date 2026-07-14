import { randomUUID } from 'node:crypto';
import { DomainError } from '@backend/shared';

export interface RoleProps {
  id: string;
  name: string;
  description?: string;
}

/**
 * Role entity, owned by auth-service (Users, Roles, UserRoles tables).
 */
export class Role {
  private constructor(private readonly props: RoleProps) {}

  static create(params: { name: string; description?: string }): Role {
    if (!params.name || params.name.trim().length === 0) {
      throw new DomainError('Role name must not be empty');
    }

    return new Role({
      id: randomUUID(),
      name: params.name.trim().toUpperCase(),
      description: params.description,
    });
  }

  static reconstitute(props: RoleProps): Role {
    return new Role(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
  }
}
