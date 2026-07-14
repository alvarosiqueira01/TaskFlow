import { NotFoundError } from '@backend/shared';
import type { UserRepository } from '../../domain/repositories/user.repository';
import type { RoleRepository } from '../../domain/repositories/role.repository';
import { Role } from '../../domain/entities/role.entity';

export class GetUserRolesUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  async execute(userId: string): Promise<Role[]> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User', userId);
    }

    return this.roleRepository.findByUserId(userId);
  }
}
