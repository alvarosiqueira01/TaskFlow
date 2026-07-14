import type { UserRepository } from '../../domain/repositories/user.repository';
import type { PasswordResetTokenRepository } from '../../domain/repositories/password-reset-token.repository';
import type { TokenService } from '../../domain/services/token-service';
import type { MailSender } from '../../domain/services/mail-sender';
import { PasswordResetToken } from '../../domain/entities/password-reset-token.entity';
import type { Logger } from '@backend/shared';

export interface RequestPasswordRecoveryCommand {
  email: string;
}

export interface RequestPasswordRecoveryDependencies {
  ttlMinutes: number;
  appBaseUrl: string;
}

export class RequestPasswordRecoveryUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
    private readonly tokenService: TokenService,
    private readonly mailSender: MailSender,
    private readonly deps: RequestPasswordRecoveryDependencies,
    private readonly logger: Logger,
  ) {}

  /**
   * Intentionally never reveals whether the email exists, to avoid
   * user enumeration. Always resolves successfully (202 Accepted at
   * the Presentation layer).
   */
  async execute(command: RequestPasswordRecoveryCommand): Promise<void> {
    const user = await this.userRepository.findByEmail(command.email);

    if (!user || !user.isActive) {
      this.logger.info({ email: command.email }, 'password recovery requested for unknown/inactive email, ignoring');
      return;
    }

    await this.passwordResetTokenRepository.invalidateAllForUser(user.id);

    const { rawToken, tokenHash } = this.tokenService.generatePasswordRecoveryToken(user.id);

    const resetToken = PasswordResetToken.create({
      userId: user.id,
      tokenHash,
      ttlMinutes: this.deps.ttlMinutes,
    });

    await this.passwordResetTokenRepository.save(resetToken);

    const resetUrl = `${this.deps.appBaseUrl}/reset-password?token=${encodeURIComponent(rawToken)}`;

    await this.mailSender.sendPasswordRecoveryEmail({
      to: user.email,
      recipientName: user.fullName ?? user.username,
      resetUrl,
      expiresInMinutes: this.deps.ttlMinutes,
    });
  }
}
