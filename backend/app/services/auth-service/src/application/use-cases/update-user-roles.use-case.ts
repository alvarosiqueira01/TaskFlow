import {
  ApplicationError,
  ErrorCode,
  EventPublisher,
  NotFoundError,
  UserUpdatedEvent as UserUpdatedIntegrationEvent,
} from '@backend/shared';
import type { UserRepository } from '../../domain/repositories/user.repository';
import type { RoleRepository } from '../../domain/repositories/role.repository';
import { Role } from '../../domain/entities/role.entity';
import { UserRolesUpdatedEvent } from '../../domain/events/user-roles-updated.domain-event';

export interface UpdateUserRolesCommand {
  userId: string;
  roleIds: string[];
  correlationId?: string;
}

export class UpdateUserRolesUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: UpdateUserRolesCommand): Promise<Role[]> {
    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      throw new NotFoundError('User', command.userId);
    }

    const resolvedRoles = await this.roleRepository.findByIds(command.roleIds);

    if (resolvedRoles.length !== command.roleIds.length) {
      throw new ApplicationError('One or more provided roleIds do not exist', ErrorCode.BAD_REQUEST);
    }

    const updatedRoles = await this.roleRepository.replaceUserRoles(command.userId, command.roleIds);
    user.replaceRoles(updatedRoles);

    const domainEvent = new UserRolesUpdatedEvent(user.id, command.roleIds);

    await this.eventPublisher.publish(
      new UserUpdatedIntegrationEvent(
        { userId: domainEvent.userId, changedFields: ['roles'] },
        'auth-service',
        command.correlationId,
      ),
    );

    return updatedRoles;
  }
}
