import { ApplicationError, NotFoundError } from '@backend/shared';
import { UpdateUserRolesUseCase } from '../../../src/application/use-cases/update-user-roles.use-case';
import { User } from '../../../src/domain/entities/user.entity';
import { Role } from '../../../src/domain/entities/role.entity';
import type { UserRepository } from '../../../src/domain/repositories/user.repository';
import type { RoleRepository } from '../../../src/domain/repositories/role.repository';

describe('UpdateUserRolesUseCase', () => {
  const userRole = Role.create({ name: 'USER' });
  const managerRole = Role.create({ name: 'PROJECT_MANAGER' });
  const existingUser = User.create({
    username: 'jane.doe',
    email: 'jane@example.com',
    passwordHash: 'hash',
    defaultRole: userRole,
  });

  function buildDependencies() {
    const userRepository: UserRepository = {
      findById: jest.fn().mockResolvedValue(existingUser),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      existsByEmail: jest.fn(),
      existsByUsername: jest.fn(),
      save: jest.fn(),
      update: jest.fn().mockResolvedValue(undefined),
    };

    const roleRepository: RoleRepository = {
      findAll: jest.fn(),
      findByIds: jest.fn().mockResolvedValue([managerRole]),
      findByUserId: jest.fn(),
      findDefaultRole: jest.fn(),
      replaceUserRoles: jest.fn().mockResolvedValue([managerRole]),
    };

    const eventPublisher = { publish: jest.fn().mockResolvedValue(undefined), publishBatch: jest.fn() };

    return { userRepository, roleRepository, eventPublisher };
  }

  it('replaces user roles and publishes UserUpdated', async () => {
    const deps = buildDependencies();
    const useCase = new UpdateUserRolesUseCase(deps.userRepository, deps.roleRepository, deps.eventPublisher as never);

    const roles = await useCase.execute({ userId: existingUser.id, roleIds: [managerRole.id] });

    expect(roles).toEqual([managerRole]);
    expect(deps.eventPublisher.publish).toHaveBeenCalledTimes(1);
  });

  it('throws NotFoundError when the user does not exist', async () => {
    const deps = buildDependencies();
    deps.userRepository.findById = jest.fn().mockResolvedValue(null);

    const useCase = new UpdateUserRolesUseCase(deps.userRepository, deps.roleRepository, deps.eventPublisher as never);

    await expect(useCase.execute({ userId: 'unknown-id', roleIds: [managerRole.id] })).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it('throws ApplicationError when a roleId does not exist', async () => {
    const deps = buildDependencies();
    deps.roleRepository.findByIds = jest.fn().mockResolvedValue([]);

    const useCase = new UpdateUserRolesUseCase(deps.userRepository, deps.roleRepository, deps.eventPublisher as never);

    await expect(
      useCase.execute({ userId: existingUser.id, roleIds: ['00000000-0000-0000-0000-000000000000'] }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });
});
