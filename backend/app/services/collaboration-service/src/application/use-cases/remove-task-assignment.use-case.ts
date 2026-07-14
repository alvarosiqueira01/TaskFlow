import { AssignmentRepository } from '../../domain/repositories/assignment.repository.js';
import { TaskReferenceRepository } from '../../domain/repositories/task-reference.repository.js';
import {
  AssignmentNotFoundError,
  ForbiddenAssignmentError,
  TaskNotFoundError,
} from '../../domain/exceptions/collaboration.exceptions.js';

export interface RemoveTaskAssignmentCommand {
  taskId: string;
  userId: string;
  requesterId: string;
  requesterRoles: string[];
}

const PRIVILEGED_ROLES = ['ADMINISTRATOR', 'PROJECT_MANAGER'];

export class RemoveTaskAssignmentUseCase {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly taskReferenceRepository: TaskReferenceRepository,
  ) {}

  async execute(command: RemoveTaskAssignmentCommand): Promise<void> {
    const taskReference = await this.taskReferenceRepository.findById(command.taskId);
    if (!taskReference) {
      throw new TaskNotFoundError(command.taskId);
    }

    const isPrivileged = command.requesterRoles.some((role) => PRIVILEGED_ROLES.includes(role));
    const isOwner = taskReference.isOwnedBy(command.requesterId);
    if (!isPrivileged && !isOwner) {
      throw new ForbiddenAssignmentError();
    }

    const existing = await this.assignmentRepository.findByTaskAndUser(command.taskId, command.userId);
    if (!existing) {
      throw new AssignmentNotFoundError(command.taskId, command.userId);
    }

    await this.assignmentRepository.delete(command.taskId, command.userId);
  }
}
