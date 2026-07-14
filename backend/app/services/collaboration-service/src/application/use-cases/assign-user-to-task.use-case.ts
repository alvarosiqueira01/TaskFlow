import { Assignment } from '../../domain/entities/assignment.entity.js';
import { AssignmentRepository } from '../../domain/repositories/assignment.repository.js';
import { TaskReferenceRepository } from '../../domain/repositories/task-reference.repository.js';
import { NotificationRepository } from '../../domain/repositories/notification.repository.js';
import { Notification } from '../../domain/entities/notification.entity.js';
import { NotificationType } from '../../domain/value-objects/notification-type.vo.js';
import { EventPublisher } from '../../domain/events/event-publisher.port.js';
import { TaskAssignedEvent } from '../../domain/events/task-assigned.event.js';
import {
  DuplicateAssignmentError,
  ForbiddenAssignmentError,
  TaskNotFoundError,
} from '../../domain/exceptions/collaboration.exceptions.js';

export interface AssignUserToTaskCommand {
  taskId: string;
  userId: string;
  requesterId: string;
  requesterRoles: string[];
}

const PRIVILEGED_ROLES = ['ADMINISTRATOR', 'PROJECT_MANAGER'];

export class AssignUserToTaskUseCase {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    private readonly taskReferenceRepository: TaskReferenceRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: AssignUserToTaskCommand): Promise<Assignment> {
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
    if (existing) {
      throw new DuplicateAssignmentError(command.taskId, command.userId);
    }

    const assignment = Assignment.create({
      taskId: command.taskId,
      userId: command.userId,
      assignedBy: command.requesterId,
    });

    await this.assignmentRepository.save(assignment);

    const notification = Notification.create({
      userId: command.userId,
      taskId: command.taskId,
      type: NotificationType.assignment(),
      title: 'You were assigned to a task',
      message: `You were assigned to task "${taskReference.title}".`,
    });
    await this.notificationRepository.save(notification);

    await this.eventPublisher.publish(
      new TaskAssignedEvent({
        taskId: command.taskId,
        taskTitle: taskReference.title,
        assignedUserId: command.userId,
        assignedBy: command.requesterId,
        assignedAt: assignment.assignedAt.toISOString(),
      }),
    );

    return assignment;
  }
}
