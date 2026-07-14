import {
  EventPublisher,
  NotFoundError,
  UnauthorizedError,
  UserUpdatedEvent as UserUpdatedIntegrationEvent,
} from '@backend/shared';
import type { UserRepository } from '../../domain/repositories/user.repository';
import type { PasswordHasher } from '../../domain/services/password-hasher';
import { UserPasswordChangedEvent } from '../../domain/events/user-password-changed.domain-event';

export interface ChangePasswordCommand {
  userId: string;
  currentPassword: string;
  newPassword: string;
  correlationId?: string;
}

export class ChangePasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ChangePasswordCommand): Promise<void> {
    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      throw new NotFoundError('User', command.userId);
    }

    const isCurrentPasswordValid = await this.passwordHasher.compare(command.currentPassword, user.passwordHash);

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    const newPasswordHash = await this.passwordHasher.hash(command.newPassword);
    user.changePassword(newPasswordHash);
    await this.userRepository.update(user);

    const domainEvent = new UserPasswordChangedEvent(user.id);

    await this.eventPublisher.publish(
      new UserUpdatedIntegrationEvent(
        { userId: domainEvent.userId, changedFields: ['password'] },
        'auth-service',
        command.correlationId,
      ),
    );
  }
}
