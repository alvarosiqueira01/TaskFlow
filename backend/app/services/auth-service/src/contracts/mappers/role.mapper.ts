import type { Role } from '../../domain/entities/role.entity';
import type { RoleResponse } from '../responses/role.response';

export class RoleMapper {
  static toResponse(role: Role): RoleResponse {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
    };
  }
}
