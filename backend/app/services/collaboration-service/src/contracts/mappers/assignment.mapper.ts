import { UserSummary } from '../../domain/repositories/user-directory.repository.js';
import { AssignedUserResponse } from '../dtos/assignment.dto.js';

export class AssignmentMapper {
  static toAssignedUserResponse(user: UserSummary): AssignedUserResponse {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
    };
  }
}
