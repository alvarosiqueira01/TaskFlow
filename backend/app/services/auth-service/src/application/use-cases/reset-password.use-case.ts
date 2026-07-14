import { EventPublisher, UnauthorizedError, UserUpdatedEvent as UserUpdatedIntegrationEvent } from '@backend/shared';
import type { UserRepository } from '../../domain/repositories/user.repository';
import type { PasswordResetTokenRepository } from '../../domain/repositories/password-reset-token.repository';
import type { PasswordHasher } from '../../domain/services/password-hasher';
import type { TokenService } from '../../domain/services/token-service';

export interface ResetPasswordCommand {
  token: string;
  newPassword: string;
  correlationId?: string;
}

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<void> {
    const tokenHash = this.tokenService.hashPasswordRecoveryToken(command.token);
    const resetToken = await this.passwordResetTokenRepository.findValidByTokenHash(tokenHash);

    if (!resetToken || !resetToken.isValid()) {
      throw new UnauthorizedError('Password recovery token is invalid or has expired');
    }

    const user = await this.userRepository.findById(resetToken.userId);

    if (!user) {
      throw new UnauthorizedError('Password recovery token is invalid or has expired');
    }

    const newPasswordHash = await this.passwordHasher.hash(command.newPassword);
    user.changePassword(newPasswordHash);

    await this.userRepository.update(user);
    await this.passwordResetTokenRepository.markUsed(resetToken.id);

    await this.eventPublisher.publish(
      new UserUpdatedIntegrationEvent(
        { userId: user.id, changedFields: ['password'] },
        'auth-service',
        command.correlationId,
      ),
    );
  }
}
