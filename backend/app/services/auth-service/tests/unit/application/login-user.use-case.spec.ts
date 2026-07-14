import { UnauthorizedError } from '@backend/shared';
import { LoginUserUseCase } from '../../../src/application/use-cases/login-user.use-case';
import { User } from '../../../src/domain/entities/user.entity';
import { Role } from '../../../src/domain/entities/role.entity';
import type { UserRepository } from '../../../src/domain/repositories/user.repository';
import type { PasswordHasher } from '../../../src/domain/services/password-hasher';
import type { TokenService } from '../../../src/domain/services/token-service';


describe('LoginUserUseCase', () => {
  const role = Role.create({ name: 'USER' });
  const existingUser = User.create({
    username: 'jane.doe',
    email: 'jane@example.com',
    passwordHash: 'stored-hash',
    defaultRole: role,
  });

  function buildDependencies() {
    const userRepository: UserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn().mockResolvedValue(existingUser),
      findByUsername: jest.fn(),
      existsByEmail: jest.fn(),
      existsByUsername: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    const passwordHasher: PasswordHasher = {
      hash: jest.fn(),
      compare: jest.fn().mockResolvedValue(true),
    };

    const tokenService: TokenService = {
      generateAccessToken: jest.fn().mockReturnValue('signed-jwt-token'),
      verifyAccessToken: jest.fn(),
      generatePasswordRecoveryToken: jest.fn(),
      hashPasswordRecoveryToken: jest.fn(),
    };

    return { userRepository, passwordHasher, tokenService };
  }

  it('authenticates a user with valid credentials', async () => {
    const deps = buildDependencies();
    const useCase = new LoginUserUseCase(deps.userRepository, deps.passwordHasher, deps.tokenService);

    const result = await useCase.execute({ email: 'jane@example.com', password: 'S3curePass!' });

    expect(result.accessToken).toBe('signed-jwt-token');
    expect(result.user.id).toBe(existingUser.id);
  });

  it('rejects an invalid password', async () => {
    const deps = buildDependencies();
    deps.passwordHasher.compare = jest.fn().mockResolvedValue(false);

    const useCase = new LoginUserUseCase(deps.userRepository, deps.passwordHasher, deps.tokenService);

    await expect(useCase.execute({ email: 'jane@example.com', password: 'wrong' })).rejects.toBeInstanceOf(
      UnauthorizedError,
    );
  });

  it('rejects when the user does not exist', async () => {
    const deps = buildDependencies();
    deps.userRepository.findByEmail = jest.fn().mockResolvedValue(null);

    const useCase = new LoginUserUseCase(deps.userRepository, deps.passwordHasher, deps.tokenService);

    await expect(useCase.execute({ email: 'unknown@example.com', password: 'any' })).rejects.toBeInstanceOf(
      UnauthorizedError,
    );
  });
});
