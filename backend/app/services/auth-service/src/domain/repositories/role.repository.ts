import type { Role } from '../entities/role.entity';

/**
 * Repository interface (contract) for the Role entity and the
 * UserRoles relationship. Implementations live in the Infrastructure layer.
 */
export interface RoleRepository {
  findAll(): Promise<Role[]>;
  findByIds(ids: string[]): Promise<Role[]>;
  findByUserId(userId: string): Promise<Role[]>;
  findDefaultRole(): Promise<Role>;
  replaceUserRoles(userId: string, roleIds: string[]): Promise<Role[]>;
}
