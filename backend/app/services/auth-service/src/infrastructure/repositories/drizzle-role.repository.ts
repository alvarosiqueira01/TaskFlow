import { eq, inArray } from 'drizzle-orm';
import { NotFoundError } from '@backend/shared';
import type { RoleRepository } from '../../domain/repositories/role.repository';
import { Role } from '../../domain/entities/role.entity';
import type { DrizzleClient } from '../database/drizzle/client';
import { roles, userRoles } from '../database/drizzle/schema';

const DEFAULT_ROLE_NAME = 'USER';

export class DrizzleRoleRepository implements RoleRepository {
  constructor(private readonly db: DrizzleClient) {}

  async findAll(): Promise<Role[]> {
    const rows = await this.db.select().from(roles);
    return rows.map((row) => Role.reconstitute({ id: row.id, name: row.name, description: row.description ?? undefined }));
  }

  async findByIds(ids: string[]): Promise<Role[]> {
    if (ids.length === 0) return [];
    const rows = await this.db.select().from(roles).where(inArray(roles.id, ids));
    return rows.map((row) => Role.reconstitute({ id: row.id, name: row.name, description: row.description ?? undefined }));
  }

  async findByUserId(userId: string): Promise<Role[]> {
    const rows = await this.db
      .select({ id: roles.id, name: roles.name, description: roles.description })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, userId));

    return rows.map((row) => Role.reconstitute({ id: row.id, name: row.name, description: row.description ?? undefined }));
  }

  async findDefaultRole(): Promise<Role> {
    const [row] = await this.db.select().from(roles).where(eq(roles.name, DEFAULT_ROLE_NAME)).limit(1);

    if (!row) {
      throw new NotFoundError('Role', DEFAULT_ROLE_NAME);
    }

    return Role.reconstitute({ id: row.id, name: row.name, description: row.description ?? undefined });
  }

  async replaceUserRoles(userId: string, roleIds: string[]): Promise<Role[]> {
    await this.db.transaction(async (tx) => {
      await tx.delete(userRoles).where(eq(userRoles.userId, userId));

      if (roleIds.length > 0) {
        await tx.insert(userRoles).values(roleIds.map((roleId) => ({ userId, roleId })));
      }
    });

    return this.findByIds(roleIds);
  }
}
