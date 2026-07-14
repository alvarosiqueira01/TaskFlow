import type { User } from '../../domain/entities/user.entity';
import type { UserResponse } from '../responses/user.response';
import { RoleMapper } from './role.mapper';

export class UserMapper {
  static toResponse(user: User): UserResponse {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      roles: user.roles.map((role) => RoleMapper.toResponse(role)),
      createdAt: user.createdAt.toISOString(),
    };
  }
}
