import { ConflictError } from '@backend/shared';
import { RegisterUserUseCase } from '../../../src/application/use-cases/register-user.use-case';
import { Role } from '../../../src/domain/entities/role.entity';
import type { UserRepository } from '../../../src/domain/repositories/user.repository';
import type { RoleRepository } from '../../../src/domain/repositories/role.repository';
import type { PasswordHasher } from '../../../src/domain/services/password-hasher';
import type { TokenService } from '../../../src/domain/services/token-service';

function buildDependencies() {
  const defaultRole = Role.create({ name: 'USER' });

  const userRepository: UserRepository = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findByUsername: jest.fn(),
    existsByEmail: jest.fn().mockResolvedValue(false),
    existsByUsername: jest.fn().mockResolvedValue(false),
    save: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
  };

  const roleRepository: RoleRepository = {
    findAll: jest.fn(),
    findByIds: jest.fn(),
    findByUserId: jest.fn(),
    findDefaultRole: jest.fn().mockResolvedValue(defaultRole),
    replaceUserRoles: jest.fn(),
  };

  const passwordHasher: PasswordHasher = {
    hash: jest.fn().mockResolvedValue('hashed-password'),
    compare: jest.fn(),
  };

  const tokenService: TokenService = {
    generateAccessToken: jest.fn().mockReturnValue('signed-jwt-token'),
    verifyAccessToken: jest.fn(),
    generatePasswordRecoveryToken: jest.fn(),
    hashPasswordRecoveryToken: jest.fn(),
  };

  const eventPublisher = { publish: jest.fn().mockResolvedValue(undefined), publishBatch: jest.fn() };

  return { userRepository, roleRepository, passwordHasher, tokenService, eventPublisher, defaultRole };
}

describe('RegisterUserUseCase', () => {
  it('registers a new user, publishes UserRegistered, and returns an access token', async () => {
    const deps = buildDependencies();
    const useCase = new RegisterUserUseCase(
      deps.userRepository,
      deps.roleRepository,
      deps.passwordHasher,
      deps.tokenService,
      deps.eventPublisher as never,
    );

    const result = await useCase.execute({
      username: 'jane.doe',
      email: 'jane@example.com',
      password: 'S3curePass!',
      fullName: 'Jane Doe',
    });

    expect(deps.userRepository.save).toHaveBeenCalledTimes(1);
    expect(deps.eventPublisher.publish).toHaveBeenCalledTimes(1);
    expect(result.accessToken).toBe('signed-jwt-token');
    expect(result.user.email).toBe('jane@example.com');
  });

  it('throws ConflictError when the email is already registered', async () => {
    const deps = buildDependencies();
    deps.userRepository.existsByEmail = jest.fn().mockResolvedValue(true);

    const useCase = new RegisterUserUseCase(
      deps.userRepository,
      deps.roleRepository,
      deps.passwordHasher,
      deps.tokenService,
      deps.eventPublisher as never,
    );

    await expect(
      useCase.execute({ username: 'jane.doe', email: 'jane@example.com', password: 'S3curePass!' }),
    ).rejects.toBeInstanceOf(ConflictError);
  });
});
