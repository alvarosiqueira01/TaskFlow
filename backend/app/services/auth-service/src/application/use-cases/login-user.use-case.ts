import { UnauthorizedError } from '@backend/shared';
import type { UserRepository } from '../../domain/repositories/user.repository';
import type { PasswordHasher } from '../../domain/services/password-hasher';
import type { TokenService } from '../../domain/services/token-service';
import { User } from '../../domain/entities/user.entity';

export interface LoginUserCommand {
  email: string;
  password: string;
}

export interface LoginUserResult {
  accessToken: string;
  user: User;
}

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
  ) {}

  async execute(command: LoginUserCommand): Promise<LoginUserResult> {
    const user = await this.userRepository.findByEmail(command.email);

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await this.passwordHasher.compare(command.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const primaryRole = user.roles[0];

    const accessToken = this.tokenService.generateAccessToken({
      sub: user.id,
      email: user.email,
      role: primaryRole.name as never,
    });

    return { accessToken, user };
  }
}
