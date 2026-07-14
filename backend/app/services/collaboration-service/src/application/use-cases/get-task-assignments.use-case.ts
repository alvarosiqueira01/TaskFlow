import { AssignmentRepository } from '../../domain/repositories/assignment.repository.js';
import { TaskReferenceRepository } from '../../domain/repositories/task-reference.repository.js';
import { UserDirectoryRepository, UserSummary } from '../../domain/repositories/user-directory.repository.js';
import { TaskNotFoundError } from '../../domain/exceptions/collaboration.exceptions.js';

export interface GetTaskAssignmentsQuery {
  taskId: string;
}

export class GetTaskAssignmentsUseCase {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly taskReferenceRepository: TaskReferenceRepository,
    private readonly userDirectoryRepository: UserDirectoryRepository,
  ) {}

  async execute(query: GetTaskAssignmentsQuery): Promise<UserSummary[]> {
    const taskReference = await this.taskReferenceRepository.findById(query.taskId);
    if (!taskReference) {
      throw new TaskNotFoundError(query.taskId);
    }

    const assignments = await this.assignmentRepository.findByTaskId(query.taskId);
    if (assignments.length === 0) {
      return [];
    }

    const userIds = assignments.map((assignment) => assignment.userId);
    return this.userDirectoryRepository.findManyByIds(userIds);
  }
}
