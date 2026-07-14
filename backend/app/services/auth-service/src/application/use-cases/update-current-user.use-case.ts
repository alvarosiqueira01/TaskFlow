import { EventPublisher, NotFoundError, UserUpdatedEvent as UserUpdatedIntegrationEvent } from '@backend/shared';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { UserProfileUpdatedEvent } from '../../domain/events/user-profile-updated.domain-event';

export interface UpdateCurrentUserCommand {
  userId: string;
  fullName?: string;
  avatarUrl?: string;
  correlationId?: string;
}

export class UpdateCurrentUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: UpdateCurrentUserCommand): Promise<User> {
    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      throw new NotFoundError('User', command.userId);
    }

    const changedFields: string[] = [];
    if (command.fullName !== undefined) changedFields.push('fullName');
    if (command.avatarUrl !== undefined) changedFields.push('avatarUrl');

    user.updateProfile({ fullName: command.fullName, avatarUrl: command.avatarUrl });
    await this.userRepository.update(user);

    if (changedFields.length > 0) {
      const domainEvent = new UserProfileUpdatedEvent(user.id, changedFields);

      await this.eventPublisher.publish(
        new UserUpdatedIntegrationEvent(
          { userId: domainEvent.userId, changedFields: domainEvent.changedFields },
          'auth-service',
          command.correlationId,
        ),
      );
    }

    return user;
  }
}
