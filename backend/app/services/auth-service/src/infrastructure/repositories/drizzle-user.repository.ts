import { eq } from 'drizzle-orm';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { Role } from '../../domain/entities/role.entity';
import type { DrizzleClient } from '../database/drizzle/client';
import { roles, userRoles, users } from '../database/drizzle/schema';

type UserRow = typeof users.$inferSelect;
type RoleRow = typeof roles.$inferSelect;

export class DrizzleUserRepository implements UserRepository {
  constructor(private readonly db: DrizzleClient) {}

  async findById(id: string): Promise<User | null> {
    const [row] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!row) return null;
    return this.hydrate(row);
  }

  async findByEmail(email: string): Promise<User | null> {
    const [row] = await this.db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    if (!row) return null;
    return this.hydrate(row);
  }

  async findByUsername(username: string): Promise<User | null> {
    const [row] = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    if (!row) return null;
    return this.hydrate(row);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const [row] = await this.db.select({ id: users.id }).from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    return Boolean(row);
  }

  async existsByUsername(username: string): Promise<boolean> {
    const [row] = await this.db.select({ id: users.id }).from(users).where(eq(users.username, username)).limit(1);
    return Boolean(row);
  }

  async save(user: User): Promise<void> {
    await this.db.transaction(async (tx) => {
      await tx.insert(users).values({
        id: user.id,
        username: user.username,
        email: user.email,
        passwordHash: user.passwordHash,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

      if (user.roles.length > 0) {
        await tx.insert(userRoles).values(user.roles.map((role) => ({ userId: user.id, roleId: role.id })));
      }
    });
  }

  async update(user: User): Promise<void> {
    await this.db
      .update(users)
      .set({
        username: user.username,
        email: user.email,
        passwordHash: user.passwordHash,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        isActive: user.isActive,
        updatedAt: user.updatedAt,
      })
      .where(eq(users.id, user.id));
  }

  private async hydrate(row: UserRow): Promise<User> {
    const roleRows: RoleRow[] = await this.db
      .select({
        id: roles.id,
        name: roles.name,
        description: roles.description,
        createdAt: roles.createdAt,
      })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, row.id));

    return User.reconstitute({
      id: row.id,
      username: (await import('../../domain/value-objects/username.vo')).Username.create(row.username),
      email: (await import('../../domain/value-objects/email.vo')).Email.create(row.email),
      passwordHash: row.passwordHash,
      fullName: row.fullName ?? undefined,
      avatarUrl: row.avatarUrl ?? undefined,
      isActive: row.isActive,
      roles: roleRows.map((r) => Role.reconstitute({ id: r.id, name: r.name, description: r.description ?? undefined })),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
