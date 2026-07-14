import { User } from '../../../src/domain/entities/user.entity';
import { Role } from '../../../src/domain/entities/role.entity';

describe('User entity', () => {
  const defaultRole = Role.create({ name: 'USER' });

  it('creates a user with the provided default role and active status', () => {
    const user = User.create({
      username: 'jane.doe',
      email: 'JANE@EXAMPLE.COM',
      passwordHash: 'hashed-password',
      fullName: 'Jane Doe',
      defaultRole,
    });

    expect(user.username).toBe('jane.doe');
    expect(user.email).toBe('jane@example.com');
    expect(user.isActive).toBe(true);
    expect(user.roles).toHaveLength(1);
    expect(user.hasRole('USER')).toBe(true);
  });

  it('rejects an invalid username', () => {
    expect(() =>
      User.create({ username: 'ab', email: 'valid@example.com', passwordHash: 'hash', defaultRole }),
    ).toThrow(/Username must be between/);
  });

  it('rejects an invalid email', () => {
    expect(() =>
      User.create({ username: 'validuser', email: 'not-an-email', passwordHash: 'hash', defaultRole }),
    ).toThrow(/Invalid email address/);
  });

  it('updates the profile and bumps updatedAt', () => {
    const user = User.create({ username: 'validuser', email: 'valid@example.com', passwordHash: 'hash', defaultRole });
    const previousUpdatedAt = user.updatedAt;

    user.updateProfile({ fullName: 'New Name' });

    expect(user.fullName).toBe('New Name');
    expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(previousUpdatedAt.getTime());
  });

  it('rejects replacing roles with an empty array', () => {
    const user = User.create({ username: 'validuser', email: 'valid@example.com', passwordHash: 'hash', defaultRole });
    expect(() => user.replaceRoles([])).toThrow(/at least one role/);
  });
});
