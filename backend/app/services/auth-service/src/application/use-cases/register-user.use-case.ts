import { ConflictError, EventPublisher } from '@backend/shared';
import { UserRegisteredEvent as UserRegisteredIntegrationEvent } from '@backend/shared';
import type { UserRepository } from '../../domain/repositories/user.repository';
import type { RoleRepository } from '../../domain/repositories/role.repository';
import type { PasswordHasher } from '../../domain/services/password-hasher';
import type { TokenService } from '../../domain/services/token-service';
import { User } from '../../domain/entities/user.entity';
import { UserRegisteredEvent } from '../../domain/events/user-registered.domain-event';

export interface RegisterUserCommand {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  correlationId?: string;
}

export interface RegisterUserResult {
  accessToken: string;
  user: User;
}

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: RegisterUserCommand): Promise<RegisterUserResult> {
    const [emailTaken, usernameTaken] = await Promise.all([
      this.userRepository.existsByEmail(command.email),
      this.userRepository.existsByUsername(command.username),
    ]);

    if (emailTaken) {
      throw new ConflictError(`Email '${command.email}' is already registered`);
    }

    if (usernameTaken) {
      throw new ConflictError(`Username '${command.username}' is already taken`);
    }

    const defaultRole = await this.roleRepository.findDefaultRole();
    const passwordHash = await this.passwordHasher.hash(command.password);

    const user = User.create({
      username: command.username,
      email: command.email,
      passwordHash,
      fullName: command.fullName,
      defaultRole,
    });

    await this.userRepository.save(user);

    const domainEvent = new UserRegisteredEvent(user.id, user.email, user.fullName ?? user.username, defaultRole.name as never);

    await this.eventPublisher.publish(
      new UserRegisteredIntegrationEvent(
        {
          userId: domainEvent.userId,
          email: domainEvent.email,
          fullName: domainEvent.fullName,
          roles: defaultRole.name as never,
        },
        'auth-service',
        command.correlationId,
      ),
    );

    const accessToken = this.tokenService.generateAccessToken({
      sub: user.id,
      email: user.email,
      role: defaultRole.name as never,
    });

    return { accessToken, user };
  }
}
